import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter23InterruptScene: NarrationLine[] = [
  {
    text: "Tom barged in with urgent news, splattering paint and breaking the quiet.",
    style: "playful",
  },
  {
    text: "The Lepercorn had called for help: humans were back and the lost scrolls were in danger.",
    style: "tense",
  },
  {
    text: "Mrs. Bigfoot’s leadership shifted the room from calm to mission-ready instantly.",
    style: "curious",
  },
]

const chapter23LegacyScene: NarrationLine[] = [
  {
    text: "Tom learned his mother had once led the Super Secret Undercover Really Cool Emergency Deployment Force.",
    style: "curious",
  },
  {
    text: "His shock turned to pride as he realized she was still capable of rising to the occasion.",
    style: "playful",
  },
  {
    text: "The family prepared to work together, guided by experience and new urgency.",
    style: "calm",
  },
]

export const Chapter23: Chapter = {
  number: 23,
  title: "Tom's Urgent News",
  scenes: [
    {
      id: "ch23_interrupt",
      title: "An Explosive Entrance",
      narration: chapter23InterruptScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "hear_the_orders",
            label: "Listen closely to the orders and prepare to mobilize.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You focus on the mission and take in every detail." },
            ],
          },
          {
            id: "question_the_risk",
            label: "Ask whether this is too dangerous and how to proceed safely.",
            effects: [
              { type: "thread", thread: "fear", amount: 1 },
              { type: "message", text: "You consider the risks before acting." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should the team respond to the urgent news?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(23, "ch23_interrupt", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("fear", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n⚡ The urgency of the news makes everyone feel the weight of the coming mission.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch23_legacy",
      title: "A Mother’s Past",
      narration: chapter23LegacyScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n👣 The family draws strength from the legacy of leadership and experience.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter23.number}: ${Chapter23.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter23.scenes) {
      console.log(`\n--- ${scene.title} ---\n`)
      scene.narration.forEach((line) => {
        const prefix = line.speaker ? `${line.speaker}: ` : ""
        console.log(`  ${prefix}${line.text}`)
      })
      await scene.execute(runtime, localRl)
      console.log("")
    }

    if (!rl) {
      localRl.close()
    }

    console.log("\n" + "=".repeat(60))
    console.log("📝 End of Chapter 23")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

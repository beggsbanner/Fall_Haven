import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter21BigfootScene: NarrationLine[] = [
  {
    text: "Mr. Bigfoot was more than a legend—he was a guardian who phased in and out of realities.",
    style: "curious",
  },
  {
    text: "He helped early hunters, found lost toys, and protected people without them knowing.",
    style: "playful",
  },
  {
    text: "His interventions were quiet but powerful, driven by duty and compassion.",
    style: "calm",
  },
]

const chapter21CasesScene: NarrationLine[] = [
  {
    text: "In mysterious cases, people returned with confused memories of a tall, shadowy helper.",
    style: "tense",
  },
  {
    text: "Mr. Bigfoot’s guiding hand kept them safe from hidden dangers and natural threats.",
    style: "curious",
  },
  {
    text: "His compassion meant he would keep helping as long as there were people in need.",
    style: "calm",
  },
]

export const Chapter21: Chapter = {
  number: 21,
  title: "The Revealed Truth of the BigFoot Enigma",
  scenes: [
    {
      id: "ch21_bigfoot",
      title: "The Ancient Guardian",
      narration: chapter21BigfootScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "trust_the_guide",
            label: "Trust the invisible guardian and look for his subtle help.",
            effects: [
              { type: "thread", thread: "bond", amount: 2 },
              { type: "message", text: "You lean into the idea that unseen protectors are watching out for you." },
            ],
          },
          {
            id: "stay_skeptical",
            label: "Remain cautious and rely on your own senses instead.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 1 },
              { type: "message", text: "You question the unseen and stay alert for hidden dangers." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "Do you trust the unseen guardian in Fall Haven?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(21, "ch21_bigfoot", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🌲 The BigFoot enigma shows that even invisible help has a story.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch21_cases",
      title: "The Guiding Hand",
      narration: chapter21CasesScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("curiosity", 1)
        console.log("\n🕵️ The hidden rescues prove that some protectors work best when unseen.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter21.number}: ${Chapter21.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter21.scenes) {
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
    console.log("📝 End of Chapter 21")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

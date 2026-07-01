import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter22RetreatScene: NarrationLine[] = [
  {
    text: "Mr. Bigfoot tried to take it easy, working on a delicate model boat in his cozy study.",
    style: "calm",
  },
  {
    text: "His wife reminded him he needed rest, but he still felt the tug to help others.",
    style: "playful",
  },
  {
    text: "Taking care of himself was hard, but he knew he couldn’t help anyone if he burned out.",
    style: "curious",
  },
]

const chapter22CallScene: NarrationLine[] = [
  {
    text: "A knock at the door interrupted his peace, bringing urgent news from the Lepercorn.",
    style: "tense",
  },
  {
    text: "Tom burst in with orders, and Mrs. Bigfoot’s leadership made the mission feel real.",
    style: "curious",
  },
  {
    text: "Mr. Bigfoot realized rest could wait once a true crisis arose.",
    style: "calm",
  },
]

export const Chapter22: Chapter = {
  number: 22,
  title: "Mr. Bigfoot's Retreat",
  scenes: [
    {
      id: "ch22_retreat",
      title: "Taking a Break",
      narration: chapter22RetreatScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "try_to_rest",
            label: "Commit to trying to rest, even if the world is asking for help.",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You recognize the value of rest before the next big challenge." },
            ],
          },
          {
            id: "prepare_to_help",
            label: "Accept that this is a moment to help, even if it means cutting the break short.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You answer the call to help and accept the sacrifice." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "Should Mr. Bigfoot keep resting or get ready to help?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 2
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(22, "ch22_retreat", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🧘 Even heroes need to learn when rest is part of strength.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch22_call",
      title: "Urgent News",
      narration: chapter22CallScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("fear", 1)
        console.log("\n📣 The call to action proves danger is too real to ignore.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter22.number}: ${Chapter22.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter22.scenes) {
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
    console.log("📝 End of Chapter 22")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

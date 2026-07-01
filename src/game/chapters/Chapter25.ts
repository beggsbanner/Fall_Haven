import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter25AwakeningScene: NarrationLine[] = [
  {
    text: "Septic awoke in the ruined goblin castle, his greed and ambition burning brighter than ever.",
    style: "tense",
  },
  {
    text: "He discovered a small stash of snot and used it to reanimate his first dark allies.",
    style: "curious",
  },
  {
    text: "With only a handful of goblins, he already began to plot a way to reclaim the scrolls and his own power.",
    style: "playful",
  },
]

const chapter25ScrollScene: NarrationLine[] = [
  {
    text: "Ooze revealed the scrolls’ hiding place in the Snotmire Caverns, and Septic’s ambition turned to a mission.",
    style: "curious",
  },
  {
    text: "Septic vowed to take the scrolls and use them to restore his goblin kingdom to terrible strength.",
    style: "tense",
  },
  {
    text: "The small band of reanimated goblins prepared to move, hungry for snot and power.",
    style: "calm",
  },
]

export const Chapter25: Chapter = {
  number: 25,
  title: "Septic's Awakening",
  scenes: [
    {
      id: "ch25_awakening",
      title: "The Goblin Rises",
      narration: chapter25AwakeningScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "embrace_greed",
            label: "Accept that the goblin threat is driven by hunger for power.",
            effects: [
              { type: "thread", thread: "fear", amount: 2 },
              { type: "message", text: "You acknowledge the danger of an enemy fueled by greed." },
            ],
          },
          {
            id: "seek_the_source",
            label: "Focus on learning where the goblins will strike first.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 1 },
              { type: "message", text: "You look for the enemy’s plan rather than just their power." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should the defenders interpret Septic’s rise?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 2
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(25, "ch25_awakening", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("fear", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🧠 Septic’s awakening makes the threat personal and strategic.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch25_scrolls",
      title: "The Scrolls’ Secret",
      narration: chapter25ScrollScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("fear", 1)
        console.log("\n📜 The scrolls are the key, and the goblins are moving to seize them.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter25.number}: ${Chapter25.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter25.scenes) {
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
    console.log("📝 End of Chapter 25")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

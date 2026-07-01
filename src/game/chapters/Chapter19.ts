import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter19WispScene: NarrationLine[] = [
  {
    text: "Dullene had once been wise and bright, guiding travelers through the forest with a warm glow.",
    style: "calm",
  },
  {
    text: "Greed crept into her heart, and the guardian transformed her into a stump wisp bound to a rotting tree.",
    style: "tense",
  },
  {
    text: "Her anger and resentment grew as the years passed, and she plotted a way to reclaim her power.",
    style: "curious",
  },
]

const chapter19GoblinScene: NarrationLine[] = [
  {
    text: "The goblins marched through the dark forest, plotting vengeance and power.",
    style: "playful",
  },
  {
    text: "Dullene saw an opportunity and offered her ambition to the goblins in exchange for restoration.",
    style: "playful",
  },
  {
    text: "She proved she could resist the treasure long enough to earn their trust and join their cause.",
    style: "calm",
  },
]

export const Chapter19: Chapter = {
  number: 19,
  title: "No Rest for Fools aka- The Foolish Stump Wisp",
  scenes: [
    {
      id: "ch19_wisp",
      title: "The Stump Wisp",
      narration: chapter19WispScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "understand_greed",
            label: "Think through how greed can twist even the kindest spirits.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You reflect on how power and greed can corrupt good intentions." },
            ],
          },
          {
            id: "watch_for_backstab",
            label: "Prepare for the possibility that the stump wisp is working with the goblins.",
            effects: [
              { type: "thread", thread: "fear", amount: 1 },
              { type: "message", text: "You stay alert for betrayal and hidden threats." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "What should the team consider about the stump wisp?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(19, "ch19_wisp", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("curiosity", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🌫️ The stump wisp’s story reveals how a small choice can change a spirit forever.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch19_goblins",
      title: "An Unlikely Alliance",
      narration: chapter19GoblinScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("fear", 1)
        console.log("\n⚠️ The goblins gain a dangerous new ally, and the stakes grow higher.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter19.number}: ${Chapter19.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter19.scenes) {
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
    console.log("📝 End of Chapter 19")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

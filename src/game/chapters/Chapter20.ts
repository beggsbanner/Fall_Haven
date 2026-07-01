import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter20HistoryScene: NarrationLine[] = [
  {
    text: "Fall Haven was born from a single curious thought, and its landscape grew from imagination itself.",
    style: "curious",
  },
  {
    text: "The realm can shift from forest to city in a blink, filled with cryptids, dragons, and impossible magic.",
    style: "playful",
  },
  {
    text: "It is a place where human dreams and strange creatures collide in perpetual transformation.",
    style: "calm",
  },
]

const chapter20TetraScene: NarrationLine[] = [
  {
    text: "At the heart of Fall Haven lies the Tetrahedron, a mystical artifact that keeps the realm balanced.",
    style: "curious",
  },
  {
    text: "Its faces represent imagination, harmony, courage, and wisdom, anchoring chaos into order.",
    style: "playful",
  },
  {
    text: "As long as the Tetrahedron remains intact, Fall Haven persists as a place of endless possibility.",
    style: "calm",
  },
]

export const Chapter20: Chapter = {
  number: 20,
  title: "A Brief History of Fall Haven",
  scenes: [
    {
      id: "ch20_history",
      title: "The Ever-Shifting Tapestry",
      narration: chapter20HistoryScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "celebrate_imagination",
            label: "Marvel at the power of imagination that created Fall Haven.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You appreciate the wonder at the heart of this realm." },
            ],
          },
          {
            id: "worry_about_change",
            label: "Consider how dangerous so much change can be without balance.",
            effects: [
              { type: "thread", thread: "fear", amount: 1 },
              { type: "message", text: "You recognize that Fall Haven’s unpredictability can be threatening." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How do you feel about the nature of Fall Haven?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(20, "ch20_history", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("curiosity", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n✨ The history of Fall Haven reminds you that even madness needs a heart.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch20_tetra",
      title: "The Tetrahedron",
      narration: chapter20TetraScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n🔷 The Tetrahedron keeps the world from tearing itself apart.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter20.number}: ${Chapter20.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter20.scenes) {
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
    console.log("📝 End of Chapter 20")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

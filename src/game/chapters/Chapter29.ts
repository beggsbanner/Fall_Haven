import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter29TetraScene: NarrationLine[] = [
  {
    text: "The Tetrahedron stood silent and guarded, its hidden sides shaping the balance of the world.",
    style: "calm",
  },
  {
    text: "Sparky explained how Chaos and Madness were as essential as courage and wisdom.",
    style: "curious",
  },
  {
    text: "The revelation made the danger feel larger, because the goblins were now feeding on forces beyond ordinary understanding.",
    style: "tense",
  },
]

const chapter29TheoryScene: NarrationLine[] = [
  {
    text: "Sparky spoke of time travel, plane folding, and multiverse manipulation, leaving Mrs. Bigfoot overwhelmed by the complexity.",
    style: "curious",
  },
  {
    text: "The Honey Badger’s knowledge was what made the stakes feel almost cosmic.",
    style: "playful",
  },
  {
    text: "Still, they resolved to use what they could know and move forward together.",
    style: "calm",
  },
]

export const Chapter29: Chapter = {
  number: 29,
  title: "The (unwritten) Secrets of the Tetrahedron",
  scenes: [
    {
      id: "ch29_tetra",
      title: "Hidden Faces",
      narration: chapter29TetraScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "dig_into_theories",
            label: "Study the Tetrahedron’s hidden sides and discover how they affect Fall Haven.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You invest in understanding the forces behind the conflict." },
            ],
          },
          {
            id: "trust_the_magic",
            label: "Accept that some things are beyond understanding and focus on what you can do.",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You lean on your allies instead of chasing impossible knowledge." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should the group respond to the Tetrahedron’s secrets?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 2
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(29, "ch29_tetra", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("curiosity", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🔺 The Tetrahedron’s hidden sides make the battle feel like more than a simple fight.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch29_theory",
      title: "Chaos and Madness",
      narration: chapter29TheoryScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("fear", 1)
        console.log("\n🌪️ The knowledge of Chaos and Madness raises the stakes and deepens the mystery.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter29.number}: ${Chapter29.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter29.scenes) {
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
    console.log("📝 End of Chapter 29")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

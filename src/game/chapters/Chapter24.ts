import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter24ForceScene: NarrationLine[] = [
  {
    text: "In the misty swamp, Mrs. Bigfoot reunited with Ned Swamp Thing and prepared to awaken the secret force.",
    style: "curious",
  },
  {
    text: "They agreed the threat was too great to ignore and that the Expeditionary Force must be mobilized.",
    style: "tense",
  },
  {
    text: "The plan was simple: gather the best cryptids, coordinate with human allies, and move before the goblins could strike.",
    style: "calm",
  },
]

const chapter24FamilyScene: NarrationLine[] = [
  {
    text: "Goldilocks and her family listened intently as Mrs. Bigfoot issued orders, each person given a vital role.",
    style: "playful",
  },
  {
    text: "The family shifted from fear to determination, ready to support the mission from behind the lines.",
    style: "calm",
  },
  {
    text: "They knew this was the moment when ordinary people became part of Fall Haven’s defense.",
    style: "curious",
  },
]

export const Chapter24: Chapter = {
  number: 24,
  title: "We Must Prepare!",
  scenes: [
    {
      id: "ch24_force",
      title: "The Force Awakens",
      narration: chapter24ForceScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "trust_old_heroes",
            label: "Trust the veteran cryptids and follow their experience.",
            effects: [
              { type: "thread", thread: "bond", amount: 2 },
              { type: "message", text: "You trust the old hands to guide the team through danger." },
            ],
          },
          {
            id: "prepare_own_plan",
            label: "Help devise a second contingency plan in case the first fails.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 1 },
              { type: "message", text: "You keep a backup plan ready for the unexpected." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should the group prepare for the mission?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(24, "ch24_force", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n⚙️ The Expeditionary Force begins to move, and Fall Haven is no longer waiting.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch24_family",
      title: "Civilian Support",
      narration: chapter24FamilyScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n🏠 Even the families join the effort, proving everyone has a part to play.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter24.number}: ${Chapter24.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter24.scenes) {
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
    console.log("📝 End of Chapter 24")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

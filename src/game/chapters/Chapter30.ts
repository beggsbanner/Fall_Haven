import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter30CampScene: NarrationLine[] = [
  {
    text: "Goldilocks arrived at the Bigfoot home to find a cryptid army camped across the lawn.",
    style: "curious",
  },
  {
    text: "Tents and colorful creatures filled the field, and the sight felt both awe-inspiring and frightening.",
    style: "playful",
  },
  {
    text: "The team knew this gathering meant the fight had grown far larger than any of them expected.",
    style: "calm",
  },
]

const chapter30BriefingScene: NarrationLine[] = [
  {
    text: "Swamp Thing explained the goblins’ new tactics, and Sparky warned that snot reserves were the real threat.",
    style: "tense",
  },
  {
    text: "The group agreed to keep automatons in support roles to avoid their corrosion by goblin snot.",
    style: "curious",
  },
  {
    text: "Every strategy now had to account for the sticky, dangerous edge the goblins had gained.",
    style: "calm",
  },
]

export const Chapter30: Chapter = {
  number: 30,
  title: "The Gathering at Bigfoot Home",
  scenes: [
    {
      id: "ch30_camp",
      title: "A Cryptid Army",
      narration: chapter30CampScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "embrace_the_team",
            label: "Feel inspired by the allies and prepare to stand with them.",
            effects: [
              { type: "thread", thread: "bond", amount: 2 },
              { type: "message", text: "You take strength from the large army gathering to support your resolve." },
            ],
          },
          {
            id: "focus_on_defense",
            label: "Stay practical and focus on the defenses rather than the spectacle.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 1 },
              { type: "message", text: "You keep your head in the game while the army forms." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How do you react to the cryptid army at Bigfoot Home?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(30, "ch30_camp", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🛡️ The gathering proves Fall Haven is uniting for something much bigger than a simple skirmish.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch30_briefing",
      title: "Plans and Warnings",
      narration: chapter30BriefingScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("fear", 1)
        console.log("\n📌 The plan now depends on understanding the enemy’s sticky advantages.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter30.number}: ${Chapter30.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter30.scenes) {
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
    console.log("📝 End of Chapter 30")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

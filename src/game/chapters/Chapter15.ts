import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter15ArrivalScene: NarrationLine[] = [
  {
    text: "Dad and Goldilocks arrived in Booger Hollow, a bustling town full of quirky charm.",
    style: "curious",
  },
  {
    text: "The group made their way to the Goblin’s Lair and Inn, where a friendly dwarf named Garrot greeted them.",
    style: "playful",
  },
  {
    text: "A Cyclops named Dooder watched their belongings, promising they were safe with him.",
    style: "calm",
  },
  {
    text: "Over dinner, they overheard talk of a giant invisible chicken, a mystic toilet, and Stuckey’s Market.",
    style: "playful",
  },
]

const chapter15ReceptionScene: NarrationLine[] = [
  {
    text: "Goldilocks asked what the rumors meant, and Ticklesticks explained that oddities were just part of life in Booger Hollow.",
    style: "playful",
  },
  {
    text: "Morvin described Stuckey as a bigfoot who could find anything, earning the respect of everyone around him.",
    style: "curious",
  },
  {
    text: "The group settled in for the night, ready to explore the market and learn more in the morning.",
    style: "calm",
  },
]

export const Chapter15: Chapter = {
  number: 15,
  title: "Welcome to Booger Hollow",
  scenes: [
    {
      id: "ch15_arrival",
      title: "Booger Hollow Arrival",
      narration: chapter15ArrivalScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "investigate_rumors",
            label: "Ask around about the invisible chicken and the mystic toilet.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You pursue the strange rumors that make Booger Hollow so memorable." },
            ],
          },
          {
            id: "rest_for_tomorrow",
            label: "Rest first and prepare for the market tomorrow.",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You choose to recover together before diving into the next adventure." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should the group begin their time in Booger Hollow?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(15, "ch15_arrival", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("curiosity", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🏘️ Booger Hollow feels alive with funny stories and hidden possibilities.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch15_reception",
      title: "Town Talk",
      narration: chapter15ReceptionScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n🍽️ The group’s first meal in town strengthens their sense of team and adventure.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter15.number}: ${Chapter15.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter15.scenes) {
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
    console.log("📝 End of Chapter 15")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

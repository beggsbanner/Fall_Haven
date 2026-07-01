import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter6MorningScene: NarrationLine[] = [
  {
    text: "As the first light of dawn filtered through the trees, the camp began to stir.",
    style: "calm",
  },
  {
    text: "Goldilocks and her dad groggily emerged from their hammocks, stretching and yawning.",
    style: "calm",
  },
  {
    text: "Ticklesticks was the last to rise, complaining about his arthritis.",
    style: "playful",
  },
  {
    text: "Booger Hollow is a peculiar place. It’s filled with all sorts of oddities and quirks.",
    speaker: "Ticklesticks",
    style: "playful",
  },
  {
    text: "Goldilocks fell into step with Morvin and asked how he became an adventurer.",
    style: "calm",
  },
  {
    text: "Ah, that’s quite a tale.", speaker: "Morvin", style: "calm",
  },
]

const chapter6TaleScene: NarrationLine[] = [
  {
    text: "Morvin explained that he had been a registration clerk for as long as anyone could remember, designed for efficiency and not adventure.",
    style: "calm",
  },
  {
    text: "He confessed that over the centuries, he had developed dreams of exploring the world beyond the guild.",
    style: "curious",
  },
  {
    text: "At night, when the guild was quiet, he would stare at the stars and imagine the freedom of the open road.",
    style: "calm",
  },
  {
    text: "His grumpiness was born from the frustration of unfulfilled dreams, not from wanting to be mean.",
    style: "calm",
  },
]

export const Chapter6: Chapter = {
  number: 6,
  title: "Booger Hollow/Morvin’s Recollection",
  scenes: [
    {
      id: "ch6_morning",
      title: "Morning at Camp",
      narration: chapter6MorningScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const morningChoices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "help_ticklesticks",
            label: "Offer to help Ticklesticks pack up camp faster",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You support your new friends as they prepare to move on." },
            ],
          },
          {
            id: "ask_morvin_more",
            label: "Ask Morvin to tell more about his dream of adventure",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You learn more about the hidden heart beneath his gears." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "What should Goldilocks and Dad do first this morning?",
              morningChoices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 2
        const selectedChoice = morningChoices[choiceIndex - 1]
        runtime.agency.applyEffects(6, "ch6_morning", selectedChoice.id, selectedChoice.label, selectedChoice.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🌅 The morning starts with a choice that shapes the group’s mood.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch6_recollection",
      title: "Morvin’s Recollection",
      narration: chapter6TaleScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("curiosity", 1)
        console.log("\n🤖 Morvin’s backstory reveals the emotional core behind his grumpy exterior.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter6.number}: ${Chapter6.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter6.scenes) {
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
    console.log("📝 End of Chapter 6")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

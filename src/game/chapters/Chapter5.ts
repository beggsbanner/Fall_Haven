import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter5CampScene: NarrationLine[] = [
  {
    text: "As the sun dipped below the horizon, the group decided it was time to set up camp for the night.",
    style: "calm",
  },
  {
    text: "Surprisingly, the camp was already prepared when they arrived at the chosen spot. Timmy had taken it upon himself to get everything ready.",
    style: "playful",
  },
  {
    text: "A cozy fire crackled merrily, and hammocks were strung up between the trees.",
    style: "calm",
  },
  {
    text: "Ticklesticks picked up a lute and sang a silly song about helping gassy fairies find herbs.",
    style: "playful",
  },
  {
    text: "Goldilocks and her dad found a quiet spot near the fire and settled in together.",
    style: "calm",
  },
  {
    text: "I miss your mom,",
    speaker: "Goldilocks",
    style: "curious",
  },
  {
    text: "She’ll be fine. We’ll make it back to her.",
    speaker: "Dad",
    style: "playful",
  },
]

const chapter5StoryScene: NarrationLine[] = [
  {
    text: "As the night grew darker, the camp settled into a peaceful rhythm and the fire crackled softly.",
    style: "calm",
  },
  {
    text: "Goldilocks and her dad told a bedtime story about acorns who lost their hats and went on an adventure to find them.",
    style: "playful",
  },
]

export const Chapter5: Chapter = {
  number: 5,
  title: "The Campfire",
  scenes: [
    {
      id: "ch5_camp",
      title: "Campfire Stories",
      narration: chapter5CampScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const campChoices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "listen_to_ticklesticks",
            label: "Listen carefully to Ticklesticks' song and ask about herbs",
            effects: [
              { type: "thread", thread: "curiosity", amount: 1 },
              { type: "message", text: "You learn more about the weird side of Fall Haven." },
            ],
          },
          {
            id: "share_your_story",
            label: "Share your own silly story with the group",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You bring the group closer with your own humor." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should Goldilocks and Dad spend the campfire evening?",
              campChoices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 2
        const selectedChoice = campChoices[choiceIndex - 1]
        runtime.agency.applyEffects(5, "ch5_camp", selectedChoice.id, selectedChoice.label, selectedChoice.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🔥 The campfire night deepens your bond with Dad and the new friends.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
    {
      id: "ch5_story",
      title: "Bedtime Tale",
      narration: chapter5StoryScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("curiosity", 1)
        console.log("\n✨ A quiet bedtime story gives everyone a moment to rest and dream.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter5.number}: ${Chapter5.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter5.scenes) {
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
    console.log("📝 End of Chapter 5")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

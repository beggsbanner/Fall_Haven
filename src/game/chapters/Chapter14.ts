import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter14DinnerScene: NarrationLine[] = [
  {
    text: "That evening they dined with the Lepercorn in a warm, enchanted home.",
    style: "calm",
  },
  {
    text: "Ticklesticks regaled them with wild tales of battles, feasts, and ridiculous adventures.",
    style: "playful",
  },
  {
    text: "Morvin shared his dream of adventure and the path that led him here.",
    style: "curious",
  },
  {
    text: "Never forget that the smallest actions can lead to the greatest adventures.",
    speaker: "Lepercorn",
    style: "playful",
  },
]

const chapter14GiftScene: NarrationLine[] = [
  {
    text: "The Lepercorn presented three small packages, each with a curious enchantment.",
    style: "curious",
  },
  {
    text: "Ticklesticks received a magical rubber chicken that squawked on command.",
    style: "playful",
  },
  {
    text: "Morvin received a compass that points to the nearest source of sparky snot.",
    style: "calm",
  },
  {
    text: "Gearrick received enchanted mittens that could fix broken machinery with a single touch.",
    style: "curious",
  },
]

export const Chapter14: Chapter = {
  number: 14,
  title: "Morvin’s Recollection: A time for Celebration",
  scenes: [
    {
      id: "ch14_dinner",
      title: "Celebration Dinner",
      narration: chapter14DinnerScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "ask_for_advice",
            label: "Ask the Lepercorn for advice about the road ahead.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You seek wisdom before continuing your quest." },
            ],
          },
          {
            id: "enjoy_the_evening",
            label: "Enjoy the meal and the company without worrying about tomorrow.",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You savor the moment with your friends." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should you spend the celebration meal?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(14, "ch14_dinner", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🍽️ The meal strengthens the bond between the adventuring party.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch14_gifts",
      title: "Gifts of the Lepercorn",
      narration: chapter14GiftScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("humor", 1)
        console.log("\n🎁 The enchanted gifts remind everyone that even silly things can be powerful.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter14.number}: ${Chapter14.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter14.scenes) {
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
    console.log("📝 End of Chapter 14")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { printQuestJournal, promptChoiceWithJournal } from "./ChapterUtils"

const chapter2CabinScene: NarrationLine[] = [
  { text: "When Goldilocks and her dad burst through the cabin door, they were immediately stopped by Tom.", style: "curious" },
  { text: "Tom was not the stereotypical Bigfoot. At only around 5 feet tall, he still had feet almost 2 feet long.", style: "playful" },
  { text: "Hurry in!", speaker: "Tom", style: "playful" },
  { text: "You’ve arrived just in time, just as the Lepercorn said you would.", speaker: "Tom", style: "playful" },
  { text: "Tom introduced himself, his voice warm and friendly, yet his eyes darted nervously around the room.", style: "calm" },
  { text: "Please, make yourselves comfortable.", speaker: "Tom", style: "playful" },
  { text: "Can I get you anything? Tea, perhaps? Or biscuits?", speaker: "Tom", style: "playful" },
  { text: "Goldilocks and her dad exchanged bewildered glances, still catching their breath from their frantic escape.", style: "calm" },
  { text: "Thank you, Tom. We’re fine for now.", speaker: "Dad", style: "playful" },
  { text: "The cabin was full of strange artifacts, colorful tapestries, and odd tools. Despite the oddity, there was a comforting warmth.", style: "calm" },
  { text: "Who exactly is the Lepercorn?", speaker: "Goldilocks", style: "curious" },
  { text: "Oh, the Lepercorn! He’s quite the character.", speaker: "Tom", style: "playful" },
  { text: "He’s got the wisdom of a unicorn and the mischief of a leprechaun.", speaker: "Tom", style: "playful" },
]

const chapter2MealScene: NarrationLine[] = [
  { text: "Before Goldilocks could ask more, another figure emerged from a side room—a manly unicorn named Bob.", style: "calm" },
  { text: "Welcome, newcomers!", speaker: "Bob", style: "playful" },
  { text: "Tom, did you offer them any food yet?", speaker: "Bob", style: "playful" },
  { text: "Just tea and biscuits. I didn’t want to overwhelm them.", speaker: "Tom", style: "playful" },
  { text: "Well, we can’t have guests going hungry, can we?", speaker: "Bob", style: "playful" },
  { text: "How about some spaghetti? I heard it’s a favorite of yours, Goldilocks.", speaker: "Bob", style: "playful" },
  { text: "Yes, please! I love spaghetti.", speaker: "Goldilocks", style: "playful" },
  { text: "Why did the spaghetti go to the party? Because it wanted to meatball the people!", speaker: "Dad", style: "playful" },
  { text: "That was a good one!", speaker: "Ticklesticks", style: "playful" },
  { text: "But can you handle a dad joke contest?", speaker: "Ticklesticks", style: "playful" },
  { text: "You’re on.", speaker: "Dad", style: "playful" },
  { text: "Why did the scarecrow win an award? Because he was outstanding in his field!", speaker: "Ticklesticks", style: "playful" },
  { text: "What do you call fake spaghetti? An impasta!", speaker: "Dad", style: "playful" },
  { text: "Alright, alright, you win.", speaker: "Ticklesticks", style: "playful" },
  { text: "Suddenly Barly, the perpetually grumpy fairy, tried a grand entrance and flew into a beam.", style: "calm" },
  { text: "Ouch! Blasted beam!", speaker: "Barly", style: "playful" },
  { text: "I was going to introduce myself with a poem, but let’s just stick to arrows for now.", speaker: "Barly", style: "playful" },
  { text: "Despite his grumpy demeanor, Barly’s fall brought another round of laughter.", style: "calm" },
]

export const Chapter2: Chapter = {
  number: 2,
  title: "Goldilocks and the Fall Haven 9",
  scenes: [
    {
      id: "ch2_cabin",
      title: "A Strange Cabin",
      narration: chapter2CabinScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("curiosity", 1)
        runtime.story.gainPageFragment(1)

        console.log("\n🪵 Goldilocks steps into the mysterious cabin and meets Tom.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch2_spaghetti",
      title: "Spaghetti and Dad Jokes",
      narration: chapter2MealScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const mealChoices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "ask_about_fall_haven_9",
            label: "Ask Tom about the Fall Haven 9",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You lean into the mystery, asking the right questions." },
            ],
          },
          {
            id: "join_dad_joke_contest",
            label: "Join Dad's joke contest to keep spirits high",
            effects: [
              { type: "thread", thread: "bond", amount: 2 },
              { type: "message", text: "Laughter makes the strange cabin feel a little more like home." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should Goldilocks and Dad respond to the Fall Haven 9?",
              mealChoices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selectedChoice = mealChoices[choiceIndex - 1]
        runtime.agency.applyEffects(2, "ch2_spaghetti", selectedChoice.id, selectedChoice.label, selectedChoice.effects)

        console.log("\n🍝 The group grows closer as the evening unfolds.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter2.number}: ${Chapter2.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter2.scenes) {
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
    console.log("📝 End of Chapter 2")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

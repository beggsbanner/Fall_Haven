import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { printQuestJournal, promptChoiceWithJournal } from "./ChapterUtils"

const chapter3ArrivalScene: NarrationLine[] = [
  { text: "Just as they were about to dig in, the door creaked open once more and in walked the Lepercorn.", style: "calm" },
  { text: "Greetings, everyone.", speaker: "Lepercorn", style: "playful" },
  { text: "I thought some garlic toast would complement the meal.", speaker: "Lepercorn", style: "playful" },
  { text: "I am the Lepercorn. It’s a pleasure to meet you.", speaker: "Lepercorn", style: "playful" },
  { text: "You have arrived at a special time, and we are here to help guide you on your journey.", speaker: "Lepercorn", style: "playful" },
  { text: "Dad, I think we’re meant to be here.", speaker: "Goldilocks", style: "curious" },
  { text: "It certainly feels that way.", speaker: "Dad", style: "playful" },
  { text: "The world is full of mysteries and wonders, but also dangers.", speaker: "Lepercorn", style: "playful" },
  { text: "Our group protects the balance. We’ve sensed a disturbance—something powerful is stirring.", speaker: "Lepercorn", style: "playful" },
  { text: "We believe you and your dad are the key to solving this mystery.", speaker: "Lepercorn", style: "playful" },
]

const chapter3QuestScene: NarrationLine[] = [
  { text: "Morvin spoke with a calm, logical tone, explaining the missing scrolls and the power of Sparky Snot.", style: "calm" },
  { text: "You see, Sparky Snot is what keeps all moving things moving, including automatons like me.", speaker: "Morvin", style: "calm" },
  { text: "Without the scrolls, the balance of Fall Haven is threatened.", speaker: "Morvin", style: "calm" },
  { text: "And don’t forget, I’m great for picking locks and keeping you warm on cold nights!", speaker: "Timmy", style: "playful" },
  { text: "I’ll be there to guide and protect you with my beasts.", speaker: "Scarlet", style: "playful" },
  { text: "We’re ready. Let’s do this!", speaker: "Goldilocks", style: "curious" },
  { text: "Then it’s settled. Tomorrow, we begin our journey to find the Scrolls of the Devilishly Handsome Honey Badger and Sparky the Dog.", speaker: "Lepercorn", style: "playful" },
]

export const Chapter3: Chapter = {
  number: 3,
  title: "The Call to Adventure",
  scenes: [
    {
      id: "ch3_arrival",
      title: "The Lepercorn Arrives",
      narration: chapter3ArrivalScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("curiosity", 1)
        runtime.story.gainPageFragment(1)

        console.log("\n✨ The Lepercorn welcomes Goldilocks and Dad into a bigger world.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch3_quest",
      title: "The Call to Adventure",
      narration: chapter3QuestScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const adventureChoices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "trust_the_lepercorn",
            label: "Trust the Lepercorn and accept the adventure plan",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "pageFragment", amount: 1 },
              { type: "message", text: "You choose to trust the guides and move forward." },
            ],
          },
          {
            id: "ask_for_details",
            label: "Ask for more details before committing",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You gather more information before embarking." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should Goldilocks respond to the adventure call?",
              adventureChoices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selectedChoice = adventureChoices[choiceIndex - 1]
        runtime.agency.applyEffects(3, "ch3_quest", selectedChoice.id, selectedChoice.label, selectedChoice.effects)

        console.log("\n🌟 The decision sets the tone for their first real quest.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter3.number}: ${Chapter3.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter3.scenes) {
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
    console.log("📝 End of Chapter 3")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter9MarketScene: NarrationLine[] = [
  {
    text: "The next morning, Morvin and Ticklesticks set out toward Booger Hollow.",
    style: "calm",
  },
  {
    text: "The emergency request was to assist an elderly Lepercorn, and the urgency was clear.",
    style: "curious",
  },
  {
    text: "Ticklesticks suddenly halted and pointed out that Morvin had no gear for the journey.",
    style: "playful",
  },
  {
    text: "We’re going to Stuckey’s Market in Booger Hollow. Stuckey’s a nice bigfoot; he’ll set you up.",
    speaker: "Ticklesticks",
    style: "playful",
  },
]

const chapter9GearScene: NarrationLine[] = [
  {
    text: "Stuckey greeted them with a warm smile and a toothy welcome.",
    style: "calm",
  },
  {
    text: "Ticklesticks handed Morvin one ridiculous item after another, each more absurd than the last.",
    style: "playful",
  },
  {
    text: "After helmets, boots, capes, and swords failed, Stuckey settled on a simple spoon and some vials of sparky snot.",
    style: "curious",
  },
  {
    text: "That should do the trick.",
    speaker: "Stuckey",
    style: "playful",
  },
]

export const Chapter9: Chapter = {
  number: 9,
  title: "Morvin’s Recollection: The Journey Begins",
  scenes: [
    {
      id: "ch9_market",
      title: "Gear Up",
      narration: chapter9MarketScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "embrace_absurd_gear",
            label: "Embrace the strange gear and trust Ticklesticks' judgment.",
            effects: [
              { type: "thread", thread: "humor", amount: 2 },
              { type: "message", text: "Morvin accepts that this adventure will be absurd and fun." },
            ],
          },
          {
            id: "insist_on_practicality",
            label: "Insist on more practical equipment before leaving.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 1 },
              { type: "message", text: "Morvin seeks gear that will actually help on the quest." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should Morvin prepare for the journey?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(9, "ch9_market", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🛍️ The gear shopping trip becomes part of the adventure itself.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch9_gear",
      title: "Sparky Snot and a Spoon",
      narration: chapter9GearScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n✨ Morvin leaves with just enough to feel ready and a lot of new questions.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter9.number}: ${Chapter9.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter9.scenes) {
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
    console.log("📝 End of Chapter 9")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

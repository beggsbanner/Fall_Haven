import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter10TrollScene: NarrationLine[] = [
  {
    text: "Morvin and Ticklesticks approached a rickety bridge spanning a rushing river.",
    style: "calm",
  },
  {
    text: "Guarding the bridge was a hulking troll who demanded they best him in a game of limericks.",
    style: "playful",
  },
  {
    text: "Leave this to me, whippersnapper. I haven’t met a riddle I couldn’t twist into a pun.",
    speaker: "Ticklesticks",
    style: "playful",
  },
  {
    text: "Ticklesticks traded rapid-fire limericks with the troll until the guardian admitted defeat.",
    style: "playful",
  },
  {
    text: "The troll let them cross, still scratching his head at the barbarian’s bizarre poetry.",
    style: "curious",
  },
]

const chapter10CrossingScene: NarrationLine[] = [
  {
    text: "As they crossed the creaky planks, Ticklesticks quipped that he was still searching for a troll who could riddle as well as he could.",
    style: "playful",
  },
  {
    text: "Morvin felt more confident with every step, the adventure growing sweeter despite the absurdity.",
    style: "curious",
  },
  {
    text: "The troll waved them off and promised another riddle if they ever returned.",
    style: "calm",
  },
]

export const Chapter10: Chapter = {
  number: 10,
  title: "Morvin’s Recollection: The Riddling Troll",
  scenes: [
    {
      id: "ch10_troll",
      title: "The Riddling Troll",
      narration: chapter10TrollScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "match_the_troll",
            label: "Match the troll’s riddles with your own witty limericks.",
            effects: [
              { type: "thread", thread: "humor", amount: 2 },
              { type: "message", text: "You join in the troll’s weird game and keep the mood light." },
            ],
          },
          {
            id: "offer_a_trade",
            label: "Offer the troll a trade instead of more riddles.",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You try a different tactic and keep the path open." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should you handle the troll challenge?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(10, "ch10_troll", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("curiosity", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🧠 The troll’s challenge sharpens your sense of humor and strategy.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch10_crossing",
      title: "Across the Bridge",
      narration: chapter10CrossingScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n🌉 The bridge crossing feels like a small triumph on a strange road.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter10.number}: ${Chapter10.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter10.scenes) {
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
    console.log("📝 End of Chapter 10")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

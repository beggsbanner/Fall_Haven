import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter8InterruptionScene: NarrationLine[] = [
  {
    text: "Just as Morvin reached for the paper, the guild doors creaked open one last time.",
    style: "curious",
  },
  {
    text: "Ticklesticks, the oldest and most eccentric barbarian in Fall Haven, strolled up with mischief in his eyes.",
    style: "playful",
  },
  {
    text: "An emergency request? Looks like I could use a little help on this one.",
    speaker: "Ticklesticks",
    style: "playful",
  },
  {
    text: "Morvin’s mechanical heart almost skipped a beat; this was the adventure he had longed for.",
    style: "curious",
  },
  {
    text: "Excellent! But first, let me tell you about the time I tickled a ghost so hard it peed itself.",
    speaker: "Ticklesticks",
    style: "playful",
  },
]

const chapter8QuestScene: NarrationLine[] = [
  {
    text: "Ticklesticks rambled through a bizarre story about ghosts, wooden spoons, and forgotten punchlines.",
    style: "playful",
  },
  {
    text: "Despite his impatience, Morvin couldn’t help but smile at the barbarian’s enthusiasm.",
    style: "calm",
  },
  {
    text: "Ticklesticks finally refocused and declared that the emergency request was for an elderly Lepercorn.",
    style: "curious",
  },
  {
    text: "He asked if Morvin was ready to join him on his last quest.",
    style: "curious",
  },
]

export const Chapter8: Chapter = {
  number: 8,
  title: "Morvin’s Recollection: The Interruption",
  scenes: [
    {
      id: "ch8_interruption",
      title: "Ticklesticks Interrupts",
      narration: chapter8InterruptionScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "trust_ticklesticks",
            label: "Trust Ticklesticks and join him on the quest immediately.",
            effects: [
              { type: "thread", thread: "bond", amount: 2 },
              { type: "message", text: "Morvin decides to follow Ticklesticks and jump into the adventure." },
            ],
          },
          {
            id: "ask_for_details",
            label: "Ask for more details about the request before committing.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 1 },
              { type: "message", text: "Morvin seeks clarity before stepping into the unknown." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should Morvin respond to Ticklesticks’ interruption?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(8, "ch8_interruption", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🪓 Ticklesticks’ wild energy makes the adventure feel real.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch8_quest",
      title: "Ready to Go",
      narration: chapter8QuestScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("curiosity", 1)
        console.log("\n✨ Morvin steps forward, ready to prove he can be more than a desk clerk.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter8.number}: ${Chapter8.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter8.scenes) {
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
    console.log("📝 End of Chapter 8")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

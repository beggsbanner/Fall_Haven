import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter12WoodsScene: NarrationLine[] = [
  {
    text: "As Morvin and Ticklesticks ventured deeper, the air grew thick with cinnamon and the woods grew darker.",
    style: "calm",
  },
  {
    text: "They found a broken automaton in the underbrush, rusted and stiff from neglect.",
    style: "curious",
  },
  {
    text: "Morvin’s mechanical heart ached. He knew he couldn’t leave a fellow automaton behind.",
    style: "curious",
  },
  {
    text: "You really think you can fix him with all that junk?",
    speaker: "Ticklesticks",
    style: "playful",
  },
  {
    text: "I have to try. Every automaton deserves a chance.",
    speaker: "Morvin",
    style: "curious",
  },
]

const chapter12RepairScene: NarrationLine[] = [
  {
    text: "Morvin gathered rusted gears, bent springs, and old screws to rebuild the broken machine.",
    style: "calm",
  },
  {
    text: "He sacrificed a piece of his own power core and poured sparky snot into the automaton’s joints.",
    style: "curious",
  },
  {
    text: "The automaton’s eyes flickered to life, and it introduced itself as Gearrick.",
    style: "playful",
  },
  {
    text: "We’ll help you find Sparky. No one deserves to be left behind.",
    speaker: "Morvin",
    style: "curious",
  },
]

export const Chapter12: Chapter = {
  number: 12,
  title: "Morvin’s Recollection: The Deep Dark Woods",
  scenes: [
    {
      id: "ch12_woods",
      title: "Deep Dark Woods",
      narration: chapter12WoodsScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "help_the_automaton",
            label: "Help the broken automaton and try to restore it.",
            effects: [
              { type: "thread", thread: "bond", amount: 2 },
              { type: "message", text: "You decide to help a fellow automaton instead of leaving him behind." },
            ],
          },
          {
            id: "leave_and_continue",
            label: "Leave the automaton and keep moving toward the Lepercorn.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 1 },
              { type: "message", text: "You keep your eye on the urgent quest ahead." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "Should Morvin help the broken automaton or keep moving?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(12, "ch12_woods", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🌲 Helping others is what makes this journey meaningful.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch12_repair",
      title: "Repairing Gearrick",
      narration: chapter12RepairScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("curiosity", 1)
        console.log("\n🔧 Morvin proves his skill and earns a new companion.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter12.number}: ${Chapter12.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter12.scenes) {
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
    console.log("📝 End of Chapter 12")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

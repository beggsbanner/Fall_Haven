import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter36RampageScene: NarrationLine[] = [
  {
    text: "The battlefield had become a living nightmare as the monstrous doll tore through everything in its path.",
    style: "tense",
  },
  {
    text: "Morvin’s desperate leap showed the defenders how far they were willing to go to stop the horror.",
    style: "curious",
  },
  {
    text: "The air smelled of metal, smoke, and the wild fury of a fight that refused to end.",
    style: "calm",
  },
]

const chapter36RescueScene: NarrationLine[] = [
  {
    text: "Ticklesticks returned with a chaotic cryptid army, and his berserker charge changed the battlefield again.",
    style: "playful",
  },
  {
    text: "Each creature brought a new, terrifying skill to the fight, turning fear into fierce determination.",
    style: "tense",
  },
  {
    text: "Their brutal assault finally toppled the monstrous doll, but the cost of the victory was not yet fully revealed.",
    style: "calm",
  },
]

export const Chapter36: Chapter = {
  number: 36,
  title: "The Barbarian's Fury",
  scenes: [
    {
      id: "ch36_rampage",
      title: "Into the Nightmare",
      narration: chapter36RampageScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "protect_morvin",
            label: "Do whatever it takes to keep Morvin from being destroyed.",
            effects: [
              { type: "thread", thread: "bond", amount: 2 },
              { type: "message", text: "You fight to save a friend and the hope he represents." },
            ],
          },
          {
            id: "focus_on_the_doll",
            label: "Target the giant doll itself, even if it means taking extreme risks.",
            effects: [
              { type: "thread", thread: "fear", amount: 1 },
              { type: "message", text: "You confront the monstrous threat head-on." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "What should the defenders prioritize against the rampaging doll?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 2
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(36, "ch36_rampage", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("fear", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n⚡ The battle becomes a desperate fight for survival as the monstrous doll rips through the lines.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch36_rescue",
      title: "The Barbarian’s Return",
      narration: chapter36RescueScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n🛡️ Ticklesticks and his furious allies deliver a final blow and save the day, at least for now.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter36.number}: ${Chapter36.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter36.scenes) {
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
    console.log(`📝 End of Chapter ${Chapter36.number}`)
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

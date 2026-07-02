import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter34ApproachScene: NarrationLine[] = [
  {
    text: "From the forest edge, the cryptid army watched the battlefield and prepared to slip in through the back field.",
    style: "curious",
  },
  {
    text: "The diverse force moved in silence, knowing surprise could turn the tide.",
    style: "tense",
  },
  {
    text: "Tom and Stuckey felt the weight of their world as the group pushed toward the chaos ahead.",
    style: "calm",
  },
]

const chapter34ChargeScene: NarrationLine[] = [
  {
    text: "The cryptids struck with strange, powerful tactics that the goblins were not ready for.",
    style: "playful",
  },
  {
    text: "Every corner of the battlefield became dangerous for the enemy as monstrous beasts and mythical fighters surged in.",
    style: "tense",
  },
  {
    text: "The tide finally began to shift, but the cost of the maneuver was clear in every wounded defender.",
    style: "calm",
  },
]

export const Chapter34: Chapter = {
  number: 34,
  title: "In Through the Back Field",
  scenes: [
    {
      id: "ch34_approach",
      title: "The Secret Ingress",
      narration: chapter34ApproachScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "move_stealthily",
            label: "Advance quietly and let the goblins remain unaware until the last moment.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You choose the element of surprise over a flashy charge." },
            ],
          },
          {
            id: "draw_them_out",
            label: "Draw attention away from your allies so they can flank from behind.",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "thread", thread: "fear", amount: 1 },
              { type: "message", text: "You sacrifice a bit of safety to protect the larger force." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "What is the best way to enter the battlefield from the back?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(34, "ch34_approach", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("curiosity", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🌲 The cryptid force moves in from the flank, bringing new danger to the goblin ranks.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch34_charge",
      title: "The Surprise Attack",
      narration: chapter34ChargeScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n🐾 The unexpected assault forces the goblins to scramble, and the defenders finally gain momentum.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter34.number}: ${Chapter34.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter34.scenes) {
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
    console.log(`📝 End of Chapter ${Chapter34.number}`)
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

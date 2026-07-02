import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter31CampScene: NarrationLine[] = [
  {
    text: "Septic strode through his camp with the manic energy of a villain convinced of his destiny.",
    style: "tense",
  },
  {
    text: "His goblin army prepared toy weapons and snot rockets, and even his own troops were a little distracted by the chaos.",
    style: "playful",
  },
  {
    text: "The leadership was loud, unpredictable, and dangerous, and that made the enemy harder to read.",
    style: "curious",
  },
]

const chapter31WeaponScene: NarrationLine[] = [
  {
    text: "Septic unveiled the secret weapon and made sure every goblin understood the stakes.",
    style: "tense",
  },
  {
    text: "The camp bristled with insanity and readiness, with snot supplies primed to cripple their foes.",
    style: "curious",
  },
  {
    text: "It was clear their first strike would be loud and ugly, but potentially devastating.",
    style: "calm",
  },
]

export const Chapter31: Chapter = {
  number: 31,
  title: "Bro! Why You So Evil?",
  scenes: [
    {
      id: "ch31_camp",
      title: "Septic’s Rally",
      narration: chapter31CampScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "study_the_enemy",
            label: "Study Septic’s army and exploit their weaknesses.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You look for a way to turn their chaos against them." },
            ],
          },
          {
            id: "hold_your_ground",
            label: "Prepare defenses because their attack will be brutal and chaotic.",
            effects: [
              { type: "thread", thread: "fear", amount: 1 },
              { type: "message", text: "You steel yourself for a violent first strike." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should Fall Haven view Septic’s army?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(31, "ch31_camp", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("curiosity", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🔥 Septic’s madness forces the defenders to pay attention to the fear behind the fury.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch31_weapon",
      title: "Ready to Strike",
      narration: chapter31WeaponScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("fear", 1)
        console.log("\n💣 The goblins prepare a dangerous first strike that will test every defense.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter31.number}: ${Chapter31.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter31.scenes) {
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
    console.log("📝 End of Chapter 31")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter33BattleScene: NarrationLine[] = [
  {
    text: "The first strike erupted with screaming arrows, exploding gadgets, and the clash of desperate defenders.",
    style: "tense",
  },
  {
    text: "Creatures of every kind threw themselves into the fight, each voice mixing fierce determination with absurd bravado.",
    style: "playful",
  },
  {
    text: "The battlefield proved the war was real, and the cost of victory would be high.",
    style: "curious",
  },
]

const chapter33ReinforcementsScene: NarrationLine[] = [
  {
    text: "A battered warship touched down, bringing Goldilocks’ family and a new wave of high-tech firepower.",
    style: "curious",
  },
  {
    text: "Their dramatic arrival shifted the battle, but it also made the stakes feel even larger and more dangerous.",
    style: "tense",
  },
  {
    text: "Hope and exhaustion coexisted as the defenders pushed through the first twelve brutal hours.",
    style: "calm",
  },
]

export const Chapter33: Chapter = {
  number: 33,
  title: "First Strike…Yeah Baby",
  scenes: [
    {
      id: "ch33_battle",
      title: "The First Clash",
      narration: chapter33BattleScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "hold_the_line",
            label: "Keep your position and absorb the initial assault.",
            effects: [
              { type: "thread", thread: "fear", amount: 2 },
              { type: "message", text: "You brace for the goblins’ brutality and commit to the defense." },
            ],
          },
          {
            id: "counter_attack",
            label: "Push back with a risky counterattack while the enemy is distracted.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 1 },
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You choose to strike while the enemy is in chaos." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "What should the defenders do when the battle begins?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(33, "ch33_battle", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("fear", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n⚔️ Fall Haven survives the opening assault, but the fight is far from over.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch33_reinforcements",
      title: "Thunder from Above",
      narration: chapter33ReinforcementsScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n🚀 The reinforcements arrive, and their power gives the defenders a chance to regroup.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter33.number}: ${Chapter33.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter33.scenes) {
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
    console.log(`📝 End of Chapter ${Chapter33.number}`)
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

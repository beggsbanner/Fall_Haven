import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter32MobilizationScene: NarrationLine[] = [
  {
    text: "The streets of Booger Hollow thrummed with nervous energy as every creature readied for the coming fight.",
    style: "tense",
  },
  {
    text: "Goldilocks stepped forward alongside her family, trying to turn fear into a message of hope for the gathered crowd.",
    style: "curious",
  },
  {
    text: "Even the mothers with their baskets and armor brought a strange reassurance, proving that strength came in many forms.",
    style: "calm",
  },
]

const chapter32JokeScene: NarrationLine[] = [
  {
    text: "A few jokes and familiar voices cut through the tension, reminding everyone that courage could still be playful.",
    style: "playful",
  },
  {
    text: "The heroes knew their unity would matter more than any single weapon in the war to come.",
    style: "calm",
  },
  {
    text: "Their resolve solidified as the people of Fall Haven prepared to stand together against the goblin threat.",
    style: "tense",
  },
]

export const Chapter32: Chapter = {
  number: 32,
  title: "A Time for Peace this is Not!",
  scenes: [
    {
      id: "ch32_mobilization",
      title: "Booger Hollow on Edge",
      narration: chapter32MobilizationScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "rally_the_villagers",
            label: "Encourage everyone to prepare together and stay focused.",
            effects: [
              { type: "thread", thread: "bond", amount: 2 },
              { type: "message", text: "You help unify the community around a shared purpose." },
            ],
          },
          {
            id: "study_the_enemy",
            label: "Listen for reports and plan around the goblins’ unpredictable tactics.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You seek to turn the enemy’s chaos against them." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should the defenders respond as the town prepares?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(32, "ch32_mobilization", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🛡️ The town steels itself, proving the fight is no longer just rumor.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch32_joke",
      title: "A Moment to Breathe",
      narration: chapter32JokeScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n😂 A few laughs remind the defenders why they fight and keep their hope alive.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter32.number}: ${Chapter32.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter32.scenes) {
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
    console.log(`📝 End of Chapter ${Chapter32.number}`)
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

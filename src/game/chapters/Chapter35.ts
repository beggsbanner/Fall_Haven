import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter35AftermathScene: NarrationLine[] = [
  {
    text: "Smoke and silence settled across the battlefield as the defenders took stock of what they had survived.",
    style: "calm",
  },
  {
    text: "Goldilocks and her family found their friends wounded but still standing, and the grief of the fight was immediate.",
    style: "tense",
  },
  {
    text: "The taste of victory was tempered by the knowledge that the war had only grown more dangerous.",
    style: "curious",
  },
]

const chapter35ThreatScene: NarrationLine[] = [
  {
    text: "A triumphant villain speech announced that the real threat was not over yet.",
    style: "playful",
  },
  {
    text: "A monstrous doll emerged, turning relief into terror and forcing the defenders to face something truly unnatural.",
    style: "tense",
  },
  {
    text: "The next wave of the fight would demand more than brute strength—it would demand courage against horror.",
    style: "calm",
  },
]

export const Chapter35: Chapter = {
  number: 35,
  title: "Dust in the Wind",
  scenes: [
    {
      id: "ch35_aftermath",
      title: "The Quiet Between Battles",
      narration: chapter35AftermathScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "tend_the_wounded",
            label: "Help the injured and keep the survivors together.",
            effects: [
              { type: "thread", thread: "bond", amount: 2 },
              { type: "message", text: "You put the wounded first and keep the group from falling apart." },
            ],
          },
          {
            id: "prepare_for_more",
            label: "Use the lull to shore up defences for the coming threat.",
            effects: [
              { type: "thread", thread: "fear", amount: 1 },
              { type: "message", text: "You prepare for the next attack while the enemy still regroups." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should the survivors use this moment of silence?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(35, "ch35_aftermath", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🌫️ The defenders heal and brace themselves, knowing their respite is fragile.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch35_threat",
      title: "The Next Horror",
      narration: chapter35ThreatScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("fear", 1)
        console.log("\n👹 The monstrous doll appears, proving the enemy still has terrifying surprises.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter35.number}: ${Chapter35.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter35.scenes) {
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
    console.log(`📝 End of Chapter ${Chapter35.number}`)
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

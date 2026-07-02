import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter28WarningScene: NarrationLine[] = [
  {
    text: "Bloop the Bard’s epic warning spread through Fall Haven like wildfire, turning whispers into alarms.",
    style: "playful",
  },
  {
    text: "Everyone felt the weight of the growing goblin force and the strange alliance of beasts that followed.",
    style: "tense",
  },
  {
    text: "The warning made clear that heroes would need to gather and face the threat together.",
    style: "curious",
  },
]

const chapter28RallyScene: NarrationLine[] = [
  {
    text: "Taverns, hollows, and treehouses all hummed with talk of the coming fight.",
    style: "calm",
  },
  {
    text: "Some hoped for heroes, while others prepared supplies and steeled themselves for battle.",
    style: "curious",
  },
  {
    text: "Every corner of Fall Haven was touched by the same ominous call to action.",
    style: "playful",
  },
]

export const Chapter28: Chapter = {
  number: 28,
  title: "The Warning- an epic by Bloop the Bard",
  scenes: [
    {
      id: "ch28_warning",
      title: "The Bard’s Call",
      narration: chapter28WarningScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "listen_to_the_bard",
            label: "Take the warning seriously and prepare immediately.",
            effects: [
              { type: "thread", thread: "fear", amount: 2 },
              { type: "message", text: "You heed the warning and act before the danger arrives." },
            ],
          },
          {
            id: "spread_the_word",
            label: "Help spread the warning to keep everyone alert.",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You make sure the whole realm knows what’s coming." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should Fall Haven respond to the bard’s warning?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(28, "ch28_warning", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("fear", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🎭 The epic warning awakens everyone to the storm gathering on the horizon.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch28_rally",
      title: "The Gathering Storm",
      narration: chapter28RallyScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n⚔️ The realm begins to organize, and unity becomes the first line of defense.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter28.number}: ${Chapter28.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter28.scenes) {
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
    console.log("📝 End of Chapter 28")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

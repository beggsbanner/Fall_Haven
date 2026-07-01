import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter26TreacheryScene: NarrationLine[] = [
  {
    text: "The Stump Wisp whispered secrets to the goblins, leading them into a deadly trap for Gearrick and Sparky.",
    style: "tense",
  },
  {
    text: "The villainous plan exploited the forest’s shadows and the heroes’ trust in a supposed ally.",
    style: "curious",
  },
  {
    text: "When the ambush began, the air filled with the sound of battle and the wet hiss of goblin snot.",
    style: "playful",
  },
]

const chapter26CaptureScene: NarrationLine[] = [
  {
    text: "Gearrick fought fiercely, but the goblins overwhelmed him, binding his limbs with sticky tendrils.",
    style: "tense",
  },
  {
    text: "Sparky tried to break free, but the goblins dragged him away, turning the rescue into a desperate escape.",
    style: "calm",
  },
  {
    text: "The heroes were separated and the danger grew, making the mission to recover the scrolls even more urgent.",
    style: "curious",
  },
]

export const Chapter26: Chapter = {
  number: 26,
  title: "The Ambush",
  scenes: [
    {
      id: "ch26_treachery",
      title: "Stump Wisp’s Betrayal",
      narration: chapter26TreacheryScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "learn_from_betrayal",
            label: "Note that allies can betray you, and prepare for deception.",
            effects: [
              { type: "thread", thread: "fear", amount: 2 },
              { type: "message", text: "You learn to watch for tricky allies in the future." },
            ],
          },
          {
            id: "rescue_focus",
            label: "Focus on rescuing Sparky, even if the cost is high.",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You prioritize saving your friend over everything else." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should you react to the ambush?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 2
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(26, "ch26_treachery", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("fear", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🐾 The ambush teaches that even the darkest strategies can be anticipated.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch26_capture",
      title: "Captured and Separated",
      narration: chapter26CaptureScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n🎯 The stakes rise as the hero is captured and the rescue becomes urgent.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter26.number}: ${Chapter26.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter26.scenes) {
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
    console.log("📝 End of Chapter 26")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

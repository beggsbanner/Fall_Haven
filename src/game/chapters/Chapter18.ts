import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter18QuietScene: NarrationLine[] = [
  {
    text: "After the reunion, the inn calmed down and the family settled into catching up.",
    style: "calm",
  },
  {
    text: "Miser Bell and Ticklesticks compared their latest exploits with laughter and pride.",
    style: "playful",
  },
  {
    text: "Mom, Dad, and the kids retold their journey and the clues that led them here.",
    style: "curious",
  },
  {
    text: "Goldilocks asked if they could continue adventuring together, and Dad promised they would—after rest.",
    style: "calm",
  },
]

const chapter18RestScene: NarrationLine[] = [
  {
    text: "The family headed upstairs to the sleeping rooms, sharing jokes and gentle teasing.",
    style: "playful",
  },
  {
    text: "Goldilocks fell asleep between her mother and sisters, content and excited for what was next.",
    style: "calm",
  },
  {
    text: "Dad lay awake for a moment, grateful for their reunion and ready for the adventures ahead.",
    style: "curious",
  },
  {
    text: "Booger Hollow had given them rest, reunion, and the promise of more to come.",
    style: "calm",
  },
]

export const Chapter18: Chapter = {
  number: 18,
  title: "Catching Up and Settling Down",
  scenes: [
    {
      id: "ch18_quiet",
      title: "A Quiet Reunion",
      narration: chapter18QuietScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "share_adventure_details",
            label: "Share the story of the journey so everyone understands the mission.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You help the family feel connected and informed." },
            ],
          },
          {
            id: "rest_for_tomorrow",
            label: "Encourage everyone to get rest before the next big day.",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You prioritize rest and family well-being." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "What is the best way to end this reunion day?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(18, "ch18_quiet", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🌙 The family’s rest is as important as any battle.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch18_rest",
      title: "Nightfall in Booger Hollow",
      narration: chapter18RestScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n😴 The night brings healing and hopeful dreams for the journey ahead.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter18.number}: ${Chapter18.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter18.scenes) {
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
    console.log("📝 End of Chapter 18")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

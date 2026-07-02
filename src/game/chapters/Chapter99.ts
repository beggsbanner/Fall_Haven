import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter99ReflectionScene: NarrationLine[] = [
  {
    text: "The battlefield had quieted, but a deeper unease lingered in the air as the price of victory became clear.",
    style: "calm",
  },
  {
    text: "Ticklesticks stood in a dim room, speaking to a strange companion who offered him a mission and a warning.",
    style: "tense",
  },
  {
    text: "His resolve shifted from rage to a weary determination as he realized the journey was not yet over.",
    style: "curious",
  },
]

const chapter99JourneyScene: NarrationLine[] = [
  {
    text: "He walked through forests, mountains, and forgotten valleys, each step carrying him farther from the comforts of home.",
    style: "playful",
  },
  {
    text: "The attic offered only haunted whispers and a fading clue, but it was enough to reignite his purpose.",
    style: "tense",
  },
  {
    text: "Ticklesticks walked into the unknown, his eyes bright with a new kind of determination.",
    style: "calm",
  },
]

export const Chapter99: Chapter = {
  number: 99,
  title: "After Everything…. Some Time has Passed",
  scenes: [
    {
      id: "ch99_reflection",
      title: "The Quiet Aftermath",
      narration: chapter99ReflectionScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "listen_to_the_warning",
            label: "Heed the mysterious warning and prepare for what lies ahead.",
            effects: [
              { type: "thread", thread: "fear", amount: 1 },
              { type: "message", text: "You accept that the threat is not finished and stay vigilant." },
            ],
          },
          {
            id: "seek_goldilocks",
            label: "Search for Goldilocks and her family before following the new clue.",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You prioritize finding your allies before moving on." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "What should Ticklesticks do after the battle?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 2
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(99, "ch99_reflection", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🧭 The survivors choose whether to follow the new path or reunite with their missing friends.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch99_journey",
      title: "The Path Forward",
      narration: chapter99JourneyScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("curiosity", 1)
        console.log("\n🚶 Ticklesticks walks into the next chapter of his story, carrying the weight of what came before.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter99.number}: ${Chapter99.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter99.scenes) {
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
    console.log(`📝 End of Chapter ${Chapter99.number}`)
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

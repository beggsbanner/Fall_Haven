import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter17ReunionScene: NarrationLine[] = [
  {
    text: "Dad stood frozen as he saw his wife and children enter the village.",
    style: "calm",
  },
  {
    text: "Goldilocks squealed with joy as she ran into her mother’s arms.",
    style: "playful",
  },
  {
    text: "Ticklesticks spotted his daughter Miser Bell and charged into a hug that lifted him off the ground.",
    style: "playful",
  },
  {
    text: "Miser Bell was cheerful and hopeful, the kind of brute who believed every problem could be solved with a smile.",
    style: "curious",
  },
]

const chapter17FamilyScene: NarrationLine[] = [
  {
    text: "Goldilocks reunited with her siblings Daniel, Melody, April, and Ethan, filling the air with laughter and hugs.",
    style: "playful",
  },
  {
    text: "Mom explained how they had followed clues through the woods to find them.",
    style: "calm",
  },
  {
    text: "The family gathered in the inn to share their story and celebrate the reunion.",
    style: "curious",
  },
  {
    text: "Ticklesticks toasted to family, friends, and future adventures, while secretly admitting he needed a nap.",
    style: "playful",
  },
]

export const Chapter17: Chapter = {
  number: 17,
  title: "Mom and Crew",
  scenes: [
    {
      id: "ch17_reunion",
      title: "Family Reunion",
      narration: chapter17ReunionScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "celebrate_reunion",
            label: "Celebrate the reunion and savor the moment.",
            effects: [
              { type: "thread", thread: "bond", amount: 2 },
              { type: "message", text: "You enjoy the joy of family reunited." },
            ],
          },
          {
            id: "ask_the_story",
            label: "Ask Mom and the kids about how they found you.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 1 },
              { type: "message", text: "You learn more about the path that led them here." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should the reunion unfold?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(17, "ch17_reunion", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n❤️ The reunion deepens the emotional stakes of the journey.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch17_family",
      title: "The Story So Far",
      narration: chapter17FamilyScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("curiosity", 1)
        console.log("\n📖 Sharing the story helps everyone understand what they’re fighting for.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter17.number}: ${Chapter17.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter17.scenes) {
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
    console.log("📝 End of Chapter 17")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

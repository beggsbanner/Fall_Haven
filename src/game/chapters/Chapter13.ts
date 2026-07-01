import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter13TaleScene: NarrationLine[] = [
  {
    text: "As they walked, Gearrick told the story of how Sparky snot was discovered.",
    style: "curious",
  },
  {
    text: "Sparky was no ordinary dog—he was powerful, serious, and incredibly intelligent.",
    style: "playful",
  },
  {
    text: "After experimenting with oils and potions, Sparky accidentally sneezed on a gear.",
    style: "curious",
  },
  {
    text: "To his astonishment, the gear started to turn smoothly.",
    style: "playful",
  },
  {
    text: "Leave it to a dog to find the answer right under his nose.",
    speaker: "Ticklesticks",
    style: "playful",
  },
]

const chapter13LepercornScene: NarrationLine[] = [
  {
    text: "Far away, the Lepercorn waited patiently in his enchanted pot of gold, humming softly.",
    style: "calm",
  },
  {
    text: "His home shimmered with magic, and he paid no mind to the waiting fork on the floor.",
    style: "curious",
  },
  {
    text: "Time was fluid for him, and he knew help would arrive eventually.",
    style: "playful",
  },
]

export const Chapter13: Chapter = {
  number: 13,
  title: "Morvin’s Recollection: Gearrick’s Tale",
  scenes: [
    {
      id: "ch13_tale",
      title: "Sparky’s Origin",
      narration: chapter13TaleScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "learn_more_about_sparky",
            label: "Ask Gearrick for more details about Sparky’s invention.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You seek the deeper story behind the magical goo." },
            ],
          },
          {
            id: "stay_focused_on_the_quest",
            label: "Stay focused on finding Sparky and move on quickly.",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You keep your eyes on the mission ahead." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "What should you do while Gearrick tells Sparky’s story?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(13, "ch13_tale", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("curiosity", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n✨ The origin of Sparky snot adds meaning to your quest.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch13_lepercorn",
      title: "Waiting for Help",
      narration: chapter13LepercornScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n🦄 The Lepercorn’s patient waiting reminds you why this quest matters.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter13.number}: ${Chapter13.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter13.scenes) {
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
    console.log("📝 End of Chapter 13")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

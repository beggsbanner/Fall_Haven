import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter11VillageScene: NarrationLine[] = [
  {
    text: "Later in their journey, Morvin and Ticklesticks stumbled upon a village in disarray.",
    style: "calm",
  },
  {
    text: "Villagers were frantic, hopping around on one foot because their left shoes had gone missing.",
    style: "playful",
  },
  {
    text: "The pixies stole all the left shoes and the town was terribly inconvenienced.",
    style: "curious",
  },
  {
    text: "My left boot! Those pesky pixies stole my left boot!",
    speaker: "Ticklesticks",
    style: "playful",
  },
]

const chapter11ResolutionScene: NarrationLine[] = [
  {
    text: "Morvin devised traps with shiny new shoes to lure the mischievous pixies out of their hideout.",
    style: "curious",
  },
  {
    text: "Ticklesticks bellowed at the pixies and recovered their hoard of left shoes.",
    style: "playful",
  },
  {
    text: "Ticklesticks discovered his own boot had been enchanted into a squeaky duck boot.",
    style: "playful",
  },
  {
    text: "The villagers cheered as the shoes were returned, and Ticklesticks immediately decided the boot added character.",
    style: "calm",
  },
]

export const Chapter11: Chapter = {
  number: 11,
  title: "Morvin’s Recollection: The Village of the Left Shoes",
  scenes: [
    {
      id: "ch11_village",
      title: "Left Shoe Chaos",
      narration: chapter11VillageScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "set_pixie_traps",
            label: "Set clever traps to lure the pixies out of hiding.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You solve the problem with a clever plan." },
            ],
          },
          {
            id: "bargain_with_pixies",
            label: "Try to bargain with the pixies for the left shoes.",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You attempt diplomacy before resorting to traps." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should you handle the pixie shoe crisis?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(11, "ch11_village", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🥿 The shoe crisis brings the village together and proves your resourcefulness.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch11_resolution",
      title: "Duck Boot Triumph",
      narration: chapter11ResolutionScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n🦆 Ticklesticks turns a disaster into a new signature move.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter11.number}: ${Chapter11.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter11.scenes) {
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
    console.log("📝 End of Chapter 11")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

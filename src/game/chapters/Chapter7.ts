import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter7OpportunityScene: NarrationLine[] = [
  {
    text: "One dreary evening, Morvin was about to close the guild when a single sheet fluttered to the floor.",
    style: "calm",
  },
  {
    text: "The bold letters at the top read: EMERGENCY REQUEST.",
    style: "curious",
  },
  {
    text: "He felt a sudden mixture of excitement and trepidation as he wondered if this could be his chance.",
    style: "curious",
  },
  {
    text: "A familiar and somewhat grating voice crackled to life. It was his mother, warning him to recharge his steam bank.",
    style: "playful",
  },
  {
    text: "I want more. I want to go on quests, to be an adventurer.",
    speaker: "Morvin",
    style: "curious",
  },
]

const chapter7FamilyScene: NarrationLine[] = [
  {
    text: "His father reminded him that he was designed to be a registration clerk, efficient and reliable.",
    style: "calm",
  },
  {
    text: "Morvin argued that maybe there was a part of him built for more than paperwork.",
    style: "curious",
  },
  {
    text: "His mother sighed and said he should be careful, but also suggested he could take the chance if it meant that much.",
    style: "playful",
  },
  {
    text: "He ended the call with a mix of relief and determination, clutching the emergency request as if it were a ticket to adventure.",
    style: "curious",
  },
]

export const Chapter7: Chapter = {
  number: 7,
  title: "Morvin’s Recollection: The Opportunity",
  scenes: [
    {
      id: "ch7_opportunity",
      title: "The Opportunity",
      narration: chapter7OpportunityScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "accept_the_request",
            label: "Accept the emergency request and embrace the chance to adventure.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "Morvin decides to follow his heart and answer the call." },
            ],
          },
          {
            id: "stay_and_prepare",
            label: "Take a moment to recharge and prepare properly before leaving.",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "Morvin chooses caution but keeps his sense of wonder alive." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should Morvin respond to the emergency request?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(7, "ch7_opportunity", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("curiosity", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n✨ Morvin feels the engine of his dreams start to hum.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch7_family",
      title: "Family Debate",
      narration: chapter7FamilyScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n🤖 Morvin’s family conversation leaves him more determined than ever.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter7.number}: ${Chapter7.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter7.scenes) {
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
    console.log("📝 End of Chapter 7")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

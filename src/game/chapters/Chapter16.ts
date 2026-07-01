import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter16MarketScene: NarrationLine[] = [
  {
    text: "The group wandered through Booger Hollow, passing the old Goblin King fountain and the crumbling castle.",
    style: "curious",
  },
  {
    text: "Ticklesticks told the grim story of the goblin snot wars and the cleanup that followed.",
    style: "playful",
  },
  {
    text: "Morvin recalled that he was created just after the goblins were defeated, living through the aftermath.",
    style: "calm",
  },
  {
    text: "They arrived at Stuckey’s Market, where Dad was outfitted and Goldilocks found armor to match her style.",
    style: "curious",
  },
]

const chapter16LuteScene: NarrationLine[] = [
  {
    text: "Stuckey revealed a special lute named P.I.W. with fire silver frets and lightning steel strings.",
    style: "playful",
  },
  {
    text: "Dad’s eyes lit up as he realized the lute could do more than just make music.",
    style: "curious",
  },
  {
    text: "Ticklesticks announced the group’s new role in a loud proclamation that made everyone cheer.",
    style: "playful",
  },
  {
    text: "Goldilocks found armor with a unicorn design and a short sword engraved with frogs.",
    style: "playful",
  },
]

export const Chapter16: Chapter = {
  number: 16,
  title: "Off to the Market We Go!",
  scenes: [
    {
      id: "ch16_market",
      title: "Stuckey’s Market",
      narration: chapter16MarketScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "choose_fun_armor",
            label: "Help Goldilocks choose armor that reflects her personality.",
            effects: [
              { type: "thread", thread: "bond", amount: 2 },
              { type: "message", text: "You help build confidence with a fresh new look." },
            ],
          },
          {
            id: "focus_on_practical_gear",
            label: "Focus on practical gear for a tough journey ahead.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 1 },
              { type: "message", text: "You make sure the team is prepared for real danger." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should the group shop at Stuckey’s Market?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(16, "ch16_market", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("bond", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🛒 The market becomes a celebration of preparation and personality.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch16_lute",
      title: "The Perfect Lute",
      narration: chapter16LuteScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("humor", 1)
        console.log("\n🎸 The discovery of P.I.W. turns shopping into a legendary moment.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter16.number}: ${Chapter16.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter16.scenes) {
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
    console.log("📝 End of Chapter 16")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

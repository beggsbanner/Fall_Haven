import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { promptChoiceWithJournal, printQuestJournal } from "./ChapterUtils"

const chapter27DiscoveryScene: NarrationLine[] = [
  {
    text: "The cavern air was damp and thick, and the vile glow of snot pools made every step feel wrong.",
    style: "tense",
  },
  {
    text: "Goldilocks, Mom, and Mrs. Bigfoot discovered goblins bathing in stolen strength, and the horror was immediate.",
    style: "curious",
  },
  {
    text: "The team realized the goblins had returned with power from the stolen scrolls and that retreat might be the only safe choice.",
    style: "calm",
  },
]

const chapter27EscapeScene: NarrationLine[] = [
  {
    text: "Goldilocks slipped away in her curiosity, despite the warnings, and the cavern quickly erupted into chaos.",
    style: "playful",
  },
  {
    text: "Sparky raced to catch up, and the tunnel became a frantic escape route lined with sticky snot and glowing enemies.",
    style: "tense",
  },
  {
    text: "In the end, the group broke free into the night, exhausted but alive, with new urgency driving them forward.",
    style: "calm",
  },
]

export const Chapter27: Chapter = {
  number: 27,
  title: "The Caverns",
  scenes: [
    {
      id: "ch27_discovery",
      title: "Snotmire Secrets",
      narration: chapter27DiscoveryScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const choices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "avoid_the_goblins",
            label: "Avoid the goblins and retreat to plan a safer counterattack.",
            effects: [
              { type: "thread", thread: "fear", amount: 2 },
              { type: "message", text: "You decide that survival and strategy matter more than a reckless fight." },
            ],
          },
          {
            id: "observe_the_enemy",
            label: "Watch closely and learn how the goblins use the snot reserves.",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You gather intelligence while staying just out of reach." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "What should the team do after seeing the goblin stronghold?",
              choices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 1
        const selected = choices[choiceIndex - 1]
        runtime.agency.applyEffects(27, "ch27_discovery", selected.id, selected.label, selected.effects)

        runtime.story.gainThread("fear", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🕯️ The Caverns reveal the goblins’ ugly new strength and force the party to move carefully.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch27_escape",
      title: "A Hasty Exit",
      narration: chapter27EscapeScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("bond", 1)
        console.log("\n🏃 The escape binds the team tighter and proves that courage must be tempered with caution.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter27.number}: ${Chapter27.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter27.scenes) {
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
    console.log("📝 End of Chapter 27")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

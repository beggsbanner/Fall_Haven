import type { Chapter } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import type { ChoiceEffect } from "../../core/Choice"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { printQuestJournal, promptChoiceWithJournal } from "./ChapterUtils"

const chapter4WorldScene: NarrationLine[] = [
  {
    text: "After finishing their meal, Goldilocks and her dad stood up, ready to face the next part of their journey.",
    style: "curious",
  },
  {
    text: "As they exited the little cabin, the world outside looked entirely different from the familiar woods they had come from.",
    style: "playful",
  },
  {
    text: "They stepped out into Fall Haven, a vibrant, magical place unlike anything Goldilocks and her dad had ever seen.",
    style: "curious",
  },
  {
    text: "At a crossroads, her dad paused, looking around in amazement.",
    style: "calm",
  },
  {
    text: "By the way, what about those crazy rabbits? Should we be worried about them?", speaker: "Dad", style: "playful",
  },
  {
    text: "No need to worry. The rabbits are no longer a problem. They’re back to their more docile selves—eating roughage and whatnot.",
    speaker: "Bob", style: "playful",
  },
  {
    text: "Goldilocks’ dad looked around and shook his head in wonder. 'I don’t think we’re in our woods anymore,' he said.",
    style: "calm",
  },
  {
    text: "The Lepercorn assured him that time worked differently here, and that they would return home safely when the adventure was done.",
    speaker: "Lepercorn", style: "playful",
  },
  {
    text: "As they walked, they heard music and laughter ahead. A traveling band appeared, led by an enormous snail with a ridiculously long name.",
    style: "playful",
  },
  {
    text: "Greetings! I am Alexander Bartholomew Charles Dexter Ezekiel Frederick Gideon Henry Isaac Jeremiah Kevin Lawrence Maximilian Nathaniel Octavius Percival Quentin Reginald Sebastian Theodore Ulysses Vincent Walter Xavier Yardley Zebediah the Snail, but you can call me A.B.C.D.E.F.G.H.I.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z. for short.",
    speaker: "ABC the Snail", style: "playful",
  },
  {
    text: "Before anyone else could react, Goldilocks’ dad jumped up eagerly and volunteered to perform.",
    style: "playful",
  },
]

const chapter4StageScene: NarrationLine[] = [
  {
    text: "A makeshift stage was set up, and the band struck a lively tune.",
    style: "playful",
  },
  {
    text: "Goldilocks’ dad began to sing a goofy tale of the Dudes and Ladies, complete with nachos and pinball.",
    style: "playful",
  },
  {
    text: "The crowd cheered as he danced in an exaggerated, hilarious manner.",
    style: "playful",
  },
  {
    text: "Tom said he knew Swamp Thing personally, and that Goldilocks’ dad had captured the story perfectly.",
    speaker: "Tom", style: "playful",
  },
  {
    text: "Bob promised more musicals at their destination, though Goldilocks’ dad insisted musicals were ridiculous.",
    style: "playful",
  },
  {
    text: "The group reached another crossroads, and the Fall Haven 9 split up to prepare for the main quest.",
    style: "calm",
  },
]

export const Chapter4: Chapter = {
  number: 4,
  title: "A New World",
  scenes: [
    {
      id: "ch4_arrival",
      title: "A New World",
      narration: chapter4WorldScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        const worldChoices: Array<{ id: string; label: string; effects: ChoiceEffect[] }> = [
          {
            id: "ask_about_rabbits",
            label: "Ask Bob more about the rabbits and their weird behavior",
            effects: [
              { type: "thread", thread: "curiosity", amount: 2 },
              { type: "message", text: "You poke at the strange rabbit story to see what else is going on." },
            ],
          },
          {
            id: "embrace_new_world",
            label: "Just enjoy the weirdness and move forward with the group",
            effects: [
              { type: "thread", thread: "bond", amount: 1 },
              { type: "message", text: "You lean into the adventure and let the strange world guide you." },
            ],
          },
        ]

        const choiceIndex = rl
          ? await promptChoiceWithJournal(
              rl,
              "How should Goldilocks and Dad respond to the new world?",
              worldChoices.map((choice) => choice.label),
              () => printQuestJournal(runtime.questManager),
            )
          : 2
        const selectedChoice = worldChoices[choiceIndex - 1]
        runtime.agency.applyEffects(4, "ch4_arrival", selectedChoice.id, selectedChoice.label, selectedChoice.effects)

        runtime.story.gainThread("curiosity", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n✨ The world feels vast and full of possibility.")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch4_stage",
      title: "Dad's Debut",
      narration: chapter4StageScene,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("humor", 1)
        runtime.story.gainPageFragment(1)
        console.log("\n🎭 Dad delights the crowd with his wildly silly performance.")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
  ],
  run: async (runtime: GameRuntime, rl?: Interface) => {
    const localRl = rl ?? createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter4.number}: ${Chapter4.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter4.scenes) {
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
    console.log("📝 End of Chapter 4")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

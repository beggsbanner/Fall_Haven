import type { GameRuntime } from "../../core/GameRuntime"
import type { Chapter } from "../../core/Chapter"
import type { NarrationLine } from "../../core/NarrationSystem"
import type { Interface } from "readline"
import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { goldilocks } from "../characters/goldilocks"

const chapter1Intro: NarrationLine[] = [
  {
    text: "Once upon a time, many years ago—yes, that's the same as 'a long, long time ago'—there was a little girl named Goldilocks.",
    style: "curious",
  },
  {
    text: "She was about seven years old, a bit of a troublemaker, but she didn't mean to make trouble most of the time. She was just curious.",
    style: "calm",
  },
  {
    text: "Goldilocks lived just inside the forest with her mother and father. They were a happy little family. And on this particular day, her mother was leaving for Grandmother's house.",
    style: "calm",
  },
  {
    text: "Goldilocks would be staying with her dad. She loved spending time with her mom, but she also enjoyed hanging out with her dad.",
    style: "playful",
  },
]

const chapter1PackingScene: NarrationLine[] = [
  {
    text: "After her mom left, Goldilocks got down to business. She gathered her little makeup set, tea party set, balloons, nail polish, and a random stuffed frog.",
    style: "playful",
  },
  {
    text: "Did I mention she got a large bag of spaghetti? She planned to have a tea party, makeover, spaghetti party with her dad and the frog.",
    style: "playful",
  },
  {
    text: "For the first few days, they played board games, participated in 13 and a half tea parties (Goldilocks got sick and threw up at the last one, but it wasn't because of all the junk food), read books, told stories, played instruments, sang a few songs, and did several impromptu dance sessions until Dad hurt his hip.",
    style: "playful",
  },
]

const chapter1Adventure: NarrationLine[] = [
  {
    text: "After about three days, Goldilocks said, 'Dad, I like to play games and read and tell stories and play music, but can we go for a hike? Can we go out into nature and explore?'",
    style: "curious",
  },
  {
    text: "Dad said, 'Of course, my Goldilocks. We shall go! We will venture into the great unknown! Are you ready? Are you ready? It's scary, it's fun, it is awesome!'",
    style: "playful",
  },
  {
    text: "Goldilocks said, 'Dad, you're silly.' And Dad said, 'Yes, I know, Goldilocks, yes, I know I am, but that is okay.'",
    style: "playful",
  },
]

const chapter1HikingScene: NarrationLine[] = [
  {
    text: "They gathered their supplies and headed out the back door down the trail into the dark woods. It doesn't have to be scary—they had torches and things, so they weren't scared. Plus, they went out there all the time.",
    style: "calm",
  },
  {
    text: "As the day wore on, they saw a creek. They stopped at the creek, which was nice and bubbling. Believe it or not, there were frogs—many frogs. So they caught frogs and crawdads and had a splendid time.",
    style: "curious",
  },
  {
    text: "Dad showed Goldilocks how to make those silly toot sounds in the mud. He also taught her important things, like how to make a fire in the safest way possible.",
    style: "calm",
  },
]

const chapter1StormScene: NarrationLine[] = [
  {
    text: "About 10 minutes later, it started to rain. Dad sprang into action when he heard a growl. Goldilocks jumped up and got behind him.",
    style: "tense",
  },
  {
    text: "Dad said it must be wolves. But then they heard heavy growling and breathing behind them and many footsteps.",
    style: "tense",
  },
  {
    text: "They ran as fast as they could, getting caught on branches and falling over nothing. It seemed natural to fall over nothing, as if their world was going to end.",
    style: "tense",
  },
  {
    text: "But then they found out it wasn't wolves at all—it was a pack of wild rabbits! The worst!",
    style: "playful",
  },
  {
    text: "Goldilocks said, 'Come on, Dad, we can make it! I see an old cabin just above us on the hill, just a little ways!' Dad said, 'You're right, Goldilocks.' He picked her up, threw her on his shoulders, and ran as fast as he could, crashing through the cabin door.",
    style: "tense",
  },
]

function promptChoice(rl: Interface, prompt: string, options: string[]): Promise<number> {
  return new Promise((resolve) => {
    const ask = () => {
      console.log(prompt)
      options.forEach((option, index) => {
        console.log(`  [${index + 1}] ${option}`)
      })
      rl.question(`Choose 1-${options.length}: `, (answer) => {
        const choice = Number(answer.trim())

        if (choice >= 1 && choice <= options.length) {
          resolve(choice)
        } else {
          console.log("Please enter a valid choice number.\n")
          ask()
        }
      })
    }

    ask()
  })
}

export const Chapter1: Chapter = {
  number: 1,
  title: "Goldilocks and the Adventure in the Woods",
  scenes: [
    {
      id: "ch1_intro",
      title: "Once Upon a Time",
      narration: chapter1Intro,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("curiosity")
        console.log("\n📖 Chapter 1 begins...")
        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch1_packing",
      title: "Goldilocks Gets Ready",
      narration: chapter1PackingScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        runtime.story.gainPageFragment()

        console.log("\n🎒 Goldilocks packs her adventuring gear...")
        console.log("💭 CHOICE: Should Goldilocks convince Dad to leave NOW, or wait for perfect weather?")

        const choice = rl
          ? await promptChoice(rl, "Choose how Goldilocks persuades Dad:", [
              "Sneak off immediately (Sneak skill)",
              "Charm Dad into going despite weather (Charm skill)",
            ])
          : 2

        if (choice === 1) {
          const sneakResult = runtime.interactions.resolve(goldilocks, {
            id: "sneak_away",
            name: "Sneak Away",
            skill: "sneak",
            difficulty: "normal",
            traitModifiers: [
              { trait: "curious", bonusDice: 1 },
              { trait: "brave", bonusDice: 1 },
            ],
          })

          if (sneakResult.check.outcome === "success") {
            console.log("✅ Goldilocks slips out while Dad is distracted!")
            runtime.story.gainThread("curiosity", 1)
            runtime.story.gainThread("bond", 1)
          } else {
            console.log("⚠️ The plan doesn't work; Dad wants to wait.")
            runtime.story.gainThread("humor", 1)
          }
        } else {
          const charmResult = runtime.interactions.resolve(goldilocks, {
            id: "charm_dad",
            name: "Charm Dad",
            skill: "charm",
            difficulty: "easy",
            traitModifiers: [
              { trait: "curious", bonusDice: 1 },
              { trait: "playful", bonusDice: 1 },
            ],
          })

          if (charmResult.check.outcome === "success") {
            console.log("✅ Goldilocks charms Dad into leaving!")
            runtime.story.gainThread("bond", 1)
          } else {
            console.log("⚠️ Dad hesitates, but he still cares.")
            runtime.story.gainThread("humor", 1)
          }
        }

        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch1_adventure_call",
      title: "The Call to Adventure",
      narration: chapter1Adventure,
      execute: async (runtime: GameRuntime) => {
        runtime.story.gainThread("curiosity", 1)
        console.log("\n🗺️ Goldilocks convinces Dad to explore...")
        console.log(runtime.story.getSummary())
        return "success"
      },
    },
    {
      id: "ch1_hiking",
      title: "Into the Forest",
      narration: chapter1HikingScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        runtime.story.gainThread("bond", 1)

        console.log("\n🏞️ A peaceful day of exploration and learning...")
        console.log("💭 CHOICE: Look for something special while at the creek?")

        const choice = rl
          ? await promptChoice(rl, "Choose how Goldilocks spends time at the creek:", [
              "Search for hidden creatures (Perception skill)",
              "Focus on learning from Dad (Bond building)",
            ])
          : 1

        if (choice === 1) {
          const percResult = runtime.interactions.resolve(goldilocks, {
            id: "search_creek_secrets",
            name: "Search for Hidden Creatures",
            skill: "perception",
            difficulty: "normal",
            traitModifiers: [
              { trait: "curious", bonusDice: 2 },
              { trait: "brave", bonusDice: 1 },
            ],
          })

          if (percResult.check.outcome === "success") {
            console.log("🔍 Goldilocks discovers a secret pool with rare frogs!")
            runtime.story.gainThread("curiosity", 1)
            runtime.story.gainEcho()
            if (percResult.check.isCriticalSuccess) {
              console.log("🔥 Critical! She finds a pristine emerald frog—incredibly rare!")
            }
          } else {
            console.log("⚠️ Nothing unusual catches her eye, but Dad's lessons are valuable.")
            runtime.story.gainThread("bond", 1)
          }
        } else {
          console.log("🤝 Goldilocks listens to Dad and grows closer to him.")
          runtime.story.gainThread("bond", 2)
        }

        console.log(runtime.story.getSummary())
        return "neutral"
      },
    },
    {
      id: "ch1_storm",
      title: "The Rabbit Panic",
      narration: chapter1StormScene,
      execute: async (runtime: GameRuntime, rl?: Interface) => {
        runtime.story.gainThread("fear", 1)
        runtime.story.gainPageFragment()

        console.log("\n⚡ A harrowing escape leads to an old cabin...")
        console.log("💭 CRITICAL MOMENT: Can Goldilocks guide them to safety?")

        const choice = rl
          ? await promptChoice(rl, "Choose Goldilocks's response:", [
              "Trust her perception of the cabin (Perception check)",
              "Help Dad stay brave (Humor check to calm him)",
            ])
          : 1

        if (choice === 1) {
          const spotCabinResult = runtime.interactions.resolve(goldilocks, {
            id: "spot_cabin_in_storm",
            name: "Spot the Cabin",
            skill: "perception",
            difficulty: "hard",
            traitModifiers: [
              { trait: "curious", bonusDice: 1 },
              { trait: "brave", bonusDice: 1 },
            ],
          })

          if (spotCabinResult.check.outcome === "success") {
            console.log("✅ Goldilocks spots the cabin and guides them safely!")
            runtime.story.gainThread("bond", 1)
            if (spotCabinResult.check.isCriticalSuccess) {
              console.log("🔥 Critical! She sees a light in the window—someone's home!")
              runtime.story.gainEcho()
            }
          } else {
            console.log("⚠️ They barely make it to shelter before the storm gets worse.")
            runtime.story.gainPageFragment()
            if (spotCabinResult.check.hasComplication) {
              console.log("💥 Complication! Dad twists his ankle in the chaos.")
              runtime.story.gainThread("fear", 1)
            }
          }
        } else {
          const calmDadResult = runtime.interactions.resolve(goldilocks, {
            id: "calm_dad_in_storm",
            name: "Calm Dad in Storm",
            skill: "humor",
            difficulty: "normal",
            traitModifiers: [
              { trait: "playful", bonusDice: 2 },
              { trait: "brave", bonusDice: 1 },
            ],
          })

          if (calmDadResult.check.outcome === "success") {
            console.log("✅ Goldilocks keeps Dad calm and together.")
            runtime.story.gainThread("bond", 1)
            runtime.story.gainThread("humor", 1)
          } else {
            console.log("⚠️ Dad is rattled, but they keep moving.")
            runtime.story.gainThread("fear", 1)
            if (calmDadResult.check.hasComplication) {
              console.log("💥 Complication! They lose sight of the cabin for a moment.")
              runtime.story.gainPageFragment()
            }
          }
        }

        console.log(runtime.story.getSummary())
        return "complication"
      },
    },
  ],
  run: async (runtime: GameRuntime) => {
    const rl = createInterface({ input: stdin, output: stdout })

    console.log("\n" + "=".repeat(60))
    console.log(`📕 CHAPTER ${Chapter1.number}: ${Chapter1.title}`)
    console.log("=".repeat(60))

    for (const scene of Chapter1.scenes) {
      console.log(`\n--- ${scene.title} ---\n`)

      // Print narration
      scene.narration.forEach((line: NarrationLine) => {
        console.log(`  ${line.text}`)
      })

      // Execute scene
      await scene.execute(runtime, rl)
      console.log("")
    }

    rl.close()

    console.log("\n" + "=".repeat(60))
    console.log("📝 End of Chapter 1")
    console.log("Story Tone:", runtime.story.getStoryTone())
    console.log("Story Summary:", runtime.story.getSummary())
    console.log("=".repeat(60) + "\n")
  },
}

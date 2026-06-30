import type { GameRuntime } from "../../core/GameRuntime"
import { goldilocks } from "../characters/goldilocks"
import { dad } from "../characters/dad"

export function runGoblinPatrolScenario(runtime: GameRuntime) {
  console.log("✅ SCENARIO FUNCTION TRIGGERED")

  runtime.story.gainThread("curiosity")
  runtime.story.gainPageFragment()

  // STEP 1 — Goldilocks Sneaks
  console.log("Goldilocks attempts to sneak past the goblin...\n")

  const sneakResult = runtime.interactions.resolve(goldilocks, {
    id: "sneak_past_goblin",
    name: "Sneak Past Goblin",
    skill: "sneak",
    difficulty: "normal",
    traitModifiers: [
      { trait: "curious", bonusDice: 1 },
      { trait: "brave", bonusDice: 1 },
    ],
  })

  if (sneakResult.check.outcome === "success") {
    runtime.story.gainThread("curiosity", 1)
    runtime.story.gainThread("bond", 1)
    runtime.story.gainEcho()

    console.log("\n✅ Goldilocks sneaks past successfully!")

    if (sneakResult.check.isCriticalSuccess) {
      console.log("🔥 Critical! She finds a hidden path forward.")
    }

    console.log("📝 Story state:", runtime.story.getSummary())
    return
  }

  console.log("\n⚠️ Goldilocks fails to sneak. The goblin is suspicious!")

  if (sneakResult.check.hasComplication) {
    runtime.story.gainThread("fear", 1)
    runtime.story.gainPageFragment()
    console.log("💥 Complication! She knocked something over.")
  }

  // STEP 2 — Dad intervenes
  console.log("\nDad attempts to distract the goblin with a joke...\n")

  const jokeResult = runtime.interactions.resolve(dad, {
    id: "dad_joke_distraction",
    name: "Dad Joke Distraction",
    skill: "humor",
    difficulty: "normal",
    traitModifiers: [
      { trait: "humorous", bonusDice: 2 },
      { trait: "laid_back", bonusDice: 1 },
    ],
  })

  // STEP 3 — Outcome
  if (jokeResult.check.outcome === "success") {
    runtime.story.gainThread("humor", 1)
    runtime.story.gainThread("bond", 1)

    console.log("\n😂 Dad succeeds! Goblin is distracted.")

    if (jokeResult.check.isCriticalSuccess) {
      console.log("🔥 Critical! Goblin is laughing uncontrollably.")
    }

    console.log("✅ Goldilocks slips away unnoticed.")
    console.log("📝 Story state:", runtime.story.getSummary())
    return
  }

  console.log("\n❌ Dad fails. The goblin is not amused...")

  if (jokeResult.check.hasComplication) {
    runtime.story.gainThread("fear", 1)
    runtime.story.gainEcho()
    console.log("💥 Complication! The goblin is now angry.")
  }

  console.log("🚨 Combat or alarm triggered!")
  console.log("📝 Story state:", runtime.story.getSummary())
}

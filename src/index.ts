import { GameRuntime } from "./core/GameRuntime"
import { runGoblinPatrolScenario } from "./game/scenarios/GoblinPatrol"
import { ScenarioManager } from "./game/scenarios/ScenarioManager"
import { Chapter1 } from "./game/chapters/Chapter1"

console.log("✅ INDEX FILE STARTED")

const runtime = new GameRuntime()
const scenarioManager = new ScenarioManager()

// =========================
// Event Listeners
// =========================

runtime.eventBus.on("interaction.resolved", (payload) => {
  console.log("Interaction resolved:", payload)
})

runtime.eventBus.on("interaction.succeeded", (payload) => {
  console.log("Interaction succeeded:", payload)
})

runtime.eventBus.on("interaction.failed", (payload) => {
  console.log("Interaction failed:", payload)
})

runtime.eventBus.on("interaction.criticalSuccess", (payload) => {
  console.log("Critical success:", payload)
})

runtime.eventBus.on("interaction.complication", (payload) => {
  console.log("Complication triggered:", payload)
})

// =========================
// Start Runtime
// =========================

console.log("✅ STARTING RUNTIME")

runtime.start()

console.log("✅ RUNTIME STARTED")

// =========================
// Run Scenario
// =========================

scenarioManager.register({
  id: "goblin_patrol",
  name: "Goblin Patrol",
  run: runGoblinPatrolScenario,
})

console.log("✅ ABOUT TO RUN CHAPTER 1")

Chapter1.run(runtime)

console.log("✅ INDEX FILE FINISHED")

import { createInterface } from "readline"
import { stdin, stdout } from "process"
import { GameRuntime } from "./core/GameRuntime"
import { runGoblinPatrolScenario } from "./game/scenarios/GoblinPatrol"
import { ScenarioManager } from "./game/scenarios/ScenarioManager"
import { chapters } from "./game/chapters/ChapterRegistry"
import { quests } from "./game/quests/QuestDefinitions"
import { printQuestJournal, promptContinueOrJournal } from "./game/chapters/ChapterUtils"

console.log("✅ INDEX FILE STARTED")

const runtime = new GameRuntime()
const scenarioManager = new ScenarioManager()
const rl = createInterface({ input: stdin, output: stdout })

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
// Run Chapters
// =========================

scenarioManager.register({
  id: "goblin_patrol",
  name: "Goblin Patrol",
  run: runGoblinPatrolScenario,
})

for (const quest of quests) {
  runtime.questManager.registerQuest(quest)
}

console.log("✅ ABOUT TO RUN ALL CHAPTERS")

async function runAllChapters(): Promise<void> {
  for (const chapter of chapters) {
    await chapter.run(runtime)
    runtime.story.recordChapterSummary(chapter.number, chapter.title)

    console.log(`\n📖 Chapter ${chapter.number} summary recorded.`)
    printQuestJournal(runtime.questManager)
    await promptContinueOrJournal(rl, () => printQuestJournal(runtime.questManager))
  }

  rl.close()

  console.log("✅ INDEX FILE FINISHED")
}

runAllChapters().catch((error) => {
  console.error("Fatal error while running chapters:", error)
  process.exit(1)
})

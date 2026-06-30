import type { GameRuntime } from "../../core/GameRuntime"

export type ScenarioDefinition = {
  id: string
  name: string
  run: (runtime: GameRuntime) => void
}

export class ScenarioManager {
  private readonly scenarios = new Map<string, ScenarioDefinition>()

  register(scenario: ScenarioDefinition): void {
    this.scenarios.set(scenario.id, scenario)
  }

  getScenario(id: string): ScenarioDefinition | undefined {
    return this.scenarios.get(id)
  }

  listScenarios(): ScenarioDefinition[] {
    return Array.from(this.scenarios.values())
  }

  run(id: string, runtime: GameRuntime): void {
    const scenario = this.getScenario(id)

    if (!scenario) {
      const available = this.listScenarios()
        .map((entry) => entry.id)
        .join(", ") || "none"

      throw new Error(
        `Scenario "${id}" was not found. Available scenarios: ${available}`,
      )
    }

    console.log(`🎮 Running scenario: ${scenario.name}`)
    scenario.run(runtime)
  }
}

import type { GameRuntime } from "./GameRuntime"
import type { ChoiceEffect, ChoiceHistoryItem } from "./Choice"
import { StoryThreadName } from "./StoryState"

export class AgencySystem {
  private flags = new Map<string, boolean>()
  private reputation = new Map<string, number>()
  private history: ChoiceHistoryItem[] = []

  constructor(private readonly runtime: GameRuntime) {}

  setFlag(flag: string, value: boolean): void {
    this.flags.set(flag, value)
  }

  getFlag(flag: string): boolean {
    return this.flags.get(flag) ?? false
  }

  modifyReputation(faction: string, amount: number): void {
    const value = this.reputation.get(faction) ?? 0
    this.reputation.set(faction, value + amount)
  }

  getReputation(faction: string): number {
    return this.reputation.get(faction) ?? 0
  }

  applyEffects(chapter: number, sceneId: string, choiceId: string, label: string, effects: ChoiceEffect[]): void {
    for (const effect of effects) {
      switch (effect.type) {
        case "thread":
          this.runtime.story.gainThread(effect.thread, effect.amount)
          break

        case "flag":
          this.setFlag(effect.flag, effect.value)
          break

        case "reputation":
          this.modifyReputation(effect.faction, effect.amount)
          break

        case "quest":
          if (effect.action === "activate") {
            this.runtime.questManager.acceptQuest(effect.questId)
          } else if (effect.action === "complete") {
            this.runtime.questManager.completeQuest(effect.questId)
          } else if (effect.action === "fail") {
            this.runtime.questManager.failQuest(effect.questId)
          }
          break

        case "pageFragment":
          this.runtime.story.gainPageFragment(effect.amount)
          break

        case "echo":
          this.runtime.story.gainEcho(effect.amount)
          break

        case "message":
          console.log(effect.text)
          break
      }
    }

    this.history.push({
      chapter,
      sceneId,
      choiceId,
      label,
      effects,
      timestamp: new Date().toISOString(),
    })
  }

  getHistory(): ChoiceHistoryItem[] {
    return [...this.history]
  }
}

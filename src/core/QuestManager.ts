import type { EventBus } from "./EventBus"
import type { StoryState, StoryThreadName } from "./StoryState"
import type { QuestStatus, SideQuest, QuestObjective, QuestObjectiveStatus } from "./SideQuest"
import type { InteractionResolution } from "../interactions/InteractionResolver"

export class QuestManager {
  private readonly quests = new Map<string, SideQuest>()

  constructor(
    private readonly eventBus: EventBus,
    private readonly story: StoryState,
  ) {
    this.eventBus.on("interaction.succeeded", (payload) =>
      this.handleInteractionEvent(payload as InteractionResolution, "success"),
    )

    this.eventBus.on("interaction.failed", (payload) =>
      this.handleInteractionEvent(payload as InteractionResolution, "failure"),
    )
  }

  registerQuest(quest: SideQuest): void {
    const normalized: SideQuest = {
      ...quest,
      status: quest.status ?? "available",
      objectives: quest.objectives.map((objective) => ({
        ...objective,
        status: objective.status ?? "pending",
        progress: objective.progress ?? 0,
      })),
    }

    this.quests.set(normalized.id, normalized)
    this.eventBus.emit("quest.registered", { quest: normalized })
  }

  getQuest(questId: string): SideQuest | undefined {
    return this.quests.get(questId)
  }

  getActiveQuests(): SideQuest[] {
    return Array.from(this.quests.values()).filter((quest) => quest.status === "active")
  }

  getAvailableQuests(): SideQuest[] {
    return Array.from(this.quests.values()).filter(
      (quest) => quest.status === "available",
    )
  }

  getQuestsByStatus(status: QuestStatus): SideQuest[] {
    return Array.from(this.quests.values()).filter((quest) => quest.status === status)
  }

  getCompletedQuests(): SideQuest[] {
    return this.getQuestsByStatus("completed")
  }

  getFailedQuests(): SideQuest[] {
    return this.getQuestsByStatus("failed")
  }

  acceptQuest(questId: string): void {
    const quest = this.quests.get(questId)
    if (!quest || quest.status !== "available") {
      return
    }

    quest.status = "active"
    quest.startedAt = new Date().toISOString()
    this.eventBus.emit("quest.accepted", { quest })
  }

  completeQuest(questId: string): void {
    const quest = this.quests.get(questId)
    if (!quest || quest.status !== "active") {
      return
    }

    quest.status = "completed"
    quest.completedAt = new Date().toISOString()
    this.applyRewards(quest)
    this.eventBus.emit("quest.completed", { quest })
  }

  failQuest(questId: string): void {
    const quest = this.quests.get(questId)
    if (!quest || quest.status !== "active") {
      return
    }

    quest.status = "failed"
    this.eventBus.emit("quest.failed", { quest })
  }

  completeObjective(questId: string, objectiveId: string): void {
    const quest = this.quests.get(questId)
    if (!quest || quest.status !== "active") {
      return
    }

    const objective = quest.objectives.find((item) => item.id === objectiveId)
    if (!objective || objective.status === "completed") {
      return
    }

    objective.status = "completed"
    this.eventBus.emit("quest.objective.completed", {
      quest,
      objective,
    })

    if (quest.objectives.every((item) => item.status === "completed")) {
      this.completeQuest(quest.id)
    }
  }

  private applyRewards(quest: SideQuest): void {
    if (!quest.rewards) {
      return
    }

    if (quest.rewards.pageFragments) {
      this.story.gainPageFragment(quest.rewards.pageFragments)
    }

    if (quest.rewards.echoes) {
      this.story.gainEcho(quest.rewards.echoes)
    }

    if (quest.rewards.threads) {
      for (const [thread, amount] of Object.entries(quest.rewards.threads)) {
        if (typeof amount === "number") {
          this.story.gainThread(thread as StoryThreadName, amount)
        }
      }
    }
  }

  private handleInteractionEvent(
    resolution: InteractionResolution,
    outcomeType: "success" | "failure",
  ): void {
    for (const quest of this.quests.values()) {
      if (quest.status !== "active") {
        continue
      }

      for (const objective of quest.objectives) {
        if (objective.status === "completed" || objective.type !== "interaction") {
          continue
        }

        if (!objective.actionId || objective.actionId !== resolution.action.id) {
          continue
        }

        if (objective.requiredOutcome) {
          if (objective.requiredOutcome === "critical") {
            if (resolution.check.isCriticalSuccess && outcomeType === "success") {
              this.completeObjective(quest.id, objective.id)
            }
            continue
          }

          if (objective.requiredOutcome === "complication") {
            if (resolution.check.hasComplication) {
              this.completeObjective(quest.id, objective.id)
            }
            continue
          }

          if (objective.requiredOutcome === outcomeType) {
            this.completeObjective(quest.id, objective.id)
          }
          continue
        }

        if (outcomeType === "success") {
          this.completeObjective(quest.id, objective.id)
        }
      }
    }
  }
}

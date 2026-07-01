import type { StoryThreadName } from "./StoryState"

export type QuestStatus = "available" | "active" | "completed" | "failed"
export type QuestObjectiveStatus = "pending" | "completed"
export type QuestObjectiveType = "interaction" | "choice" | "fragment" | "custom"

export type QuestObjective = {
  id: string
  description: string
  type: QuestObjectiveType
  status?: QuestObjectiveStatus
  actionId?: string
  requiredOutcome?: "success" | "failure" | "critical" | "complication"
  progress?: number
  requiredProgress?: number
}

export type QuestReward = {
  pageFragments?: number
  echoes?: number
  threads?: Partial<Record<StoryThreadName, number>>
  items?: string[]
}

export interface SideQuest {
  id: string
  title: string
  description: string
  offeredAtChapter: number
  status: QuestStatus
  objectives: QuestObjective[]
  rewards?: QuestReward
  isRepeatable?: boolean
  isHidden?: boolean
  startedAt?: string
  completedAt?: string
}

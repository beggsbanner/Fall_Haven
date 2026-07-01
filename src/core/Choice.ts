import type { StoryThreadName } from "./StoryState"
import type { QuestStatus } from "./SideQuest"

export type ChoiceEffect =
  | {
      type: "thread"
      thread: StoryThreadName
      amount: number
    }
  | {
      type: "flag"
      flag: string
      value: boolean
    }
  | {
      type: "reputation"
      faction: string
      amount: number
    }
  | {
      type: "quest"
      questId: string
      action: "activate" | "complete" | "fail"
    }
  | {
      type: "pageFragment"
      amount: number
    }
  | {
      type: "echo"
      amount: number
    }
  | {
      type: "message"
      text: string
    }

export type ChoiceHistoryItem = {
  chapter: number
  sceneId: string
  choiceId: string
  label: string
  effects: ChoiceEffect[]
  timestamp: string
}

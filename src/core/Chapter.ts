import type { GameRuntime } from "./GameRuntime"
import type { NarrationLine } from "./NarrationSystem"

export type SceneOutcome = "success" | "failure" | "neutral" | "complication"

export interface SceneChoice {
  id: string
  text: string
  skillCheck?: {
    skill: string
    difficulty: "easy" | "normal" | "hard"
  }
  threads?: {
    thread: string
    amount: number
  }[]
}

export interface Scene {
  id: string
  title: string
  narration: NarrationLine[]
  execute: (runtime: GameRuntime) => Promise<SceneOutcome>
}

export interface Chapter {
  number: number
  title: string
  scenes: Scene[]
  run: (runtime: GameRuntime) => Promise<void>
}

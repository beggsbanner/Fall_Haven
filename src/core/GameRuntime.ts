import { EventBus } from "./EventBus"
import { InteractionResolver } from "../interactions/InteractionResolver"
import { QuestManager } from "./QuestManager"
import { AgencySystem } from "./AgencySystem"
import { StoryState } from "./StoryState"

export type RuntimeStatus = "created" | "running" | "paused" | "stopped"

export class GameRuntime {
  readonly eventBus: EventBus
  readonly interactions: InteractionResolver
  readonly questManager: QuestManager
  readonly agency: AgencySystem
  readonly story: StoryState

  private status: RuntimeStatus = "created"
  private lastUpdateTime = 0

  constructor() {
    this.eventBus = new EventBus()
    this.story = new StoryState()
    this.interactions = new InteractionResolver(this.eventBus)
    this.questManager = new QuestManager(this.eventBus, this.story)
    this.agency = new AgencySystem(this)
  }

  start(): void {
    if (this.status === "running") {
      return
    }

    this.status = "running"
    this.lastUpdateTime = performance.now()

    this.eventBus.emit("runtime.started", {
      status: this.status,
      startedAt: new Date().toISOString(),
    })
  }

  pause(): void {
    if (this.status !== "running") {
      return
    }

    this.status = "paused"

    this.eventBus.emit("runtime.paused", {
      status: this.status,
      pausedAt: new Date().toISOString(),
    })
  }

  resume(): void {
    if (this.status !== "paused") {
      return
    }

    this.status = "running"
    this.lastUpdateTime = performance.now()

    this.eventBus.emit("runtime.resumed", {
      status: this.status,
      resumedAt: new Date().toISOString(),
    })
  }

  stop(): void {
    if (this.status === "stopped") {
      return
    }

    this.status = "stopped"

    this.eventBus.emit("runtime.stopped", {
      status: this.status,
      stoppedAt: new Date().toISOString(),
    })
  }

  update(): void {
    if (this.status !== "running") {
      return
    }

    const now = performance.now()
    const deltaMs = now - this.lastUpdateTime
    this.lastUpdateTime = now

    this.eventBus.emit("runtime.updated", {
      deltaMs,
      deltaSeconds: deltaMs / 1000,
      updatedAt: new Date().toISOString(),
    })
  }

  getStatus(): RuntimeStatus {
    return this.status
  }
}

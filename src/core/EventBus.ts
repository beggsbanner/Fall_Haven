export type GameEventPayload = Record<string, unknown>

export type GameEventHandler<TPayload = GameEventPayload> = (
  payload: TPayload,
) => void

export type EventUnsubscribe = () => void

export class EventBus {
  private listeners = new Map<string, Set<GameEventHandler>>()

  on<TPayload = GameEventPayload>(
    eventName: string,
    handler: GameEventHandler<TPayload>,
  ): EventUnsubscribe {
    const existingHandlers = this.listeners.get(eventName)

    if (existingHandlers) {
      existingHandlers.add(handler as GameEventHandler)
    } else {
      this.listeners.set(eventName, new Set([handler as GameEventHandler]))
    }

    return () => {
      this.off(eventName, handler as GameEventHandler)
    }
  }

  once<TPayload = GameEventPayload>(
    eventName: string,
    handler: GameEventHandler<TPayload>,
  ): EventUnsubscribe {
    const unsubscribe = this.on<TPayload>(eventName, (payload) => {
      unsubscribe()
      handler(payload)
    })

    return unsubscribe
  }

  off(eventName: string, handler: GameEventHandler): void {
    const handlers = this.listeners.get(eventName)

    if (!handlers) {
      return
    }

    handlers.delete(handler)

    if (handlers.size === 0) {
      this.listeners.delete(eventName)
    }
  }

  emit<TPayload = GameEventPayload>(
    eventName: string,
    payload: TPayload,
  ): void {
    const handlers = this.listeners.get(eventName)

    if (!handlers) {
      return
    }

    for (const handler of handlers) {
      handler(payload as GameEventPayload)
    }
  }

  clear(eventName?: string): void {
    if (eventName) {
      this.listeners.delete(eventName)
      return
    }

    this.listeners.clear()
  }

  listenerCount(eventName: string): number {
    return this.listeners.get(eventName)?.size ?? 0
  }
}

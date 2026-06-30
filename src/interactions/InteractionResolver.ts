import type { EventBus } from "../core/EventBus"
import type { Character, SkillName } from "../entities/Character"
import { getSkillValue, hasTrait } from "../entities/Character"
import { rollDice, type RollResult } from "../rules/dice"
import type { Difficulty } from "../rules/difficulty"
import { resolveCheck, type CheckResolution } from "../rules/resolution"

export type InteractionTarget =
  | Character
  | {
      id: string
      name?: string
      type?: string
      tags?: string[]
    }

export type TraitModifier = {
  trait: string
  bonusDice: number
  reason?: string
}

export type InteractionAction = {
  id: string
  name: string
  skill: SkillName
  difficulty: Difficulty
  baseBonusDice?: number
  traitModifiers?: TraitModifier[]
}

export type InteractionResolution = {
  actor: Character
  target?: InteractionTarget
  action: InteractionAction
  dicePool: number
  roll: RollResult
  check: CheckResolution
  appliedTraitModifiers: TraitModifier[]
}

export class InteractionResolver {
  constructor(private readonly eventBus: EventBus) {}

  resolve(
    actor: Character,
    action: InteractionAction,
    target?: InteractionTarget,
  ): InteractionResolution {
    const baseSkillValue = getSkillValue(actor, action.skill)
    const baseBonusDice = action.baseBonusDice ?? 0

    const appliedTraitModifiers = this.getAppliedTraitModifiers(actor, action)

    const traitBonusDice = appliedTraitModifiers.reduce(
      (total, modifier) => total + modifier.bonusDice,
      0,
    )

    const dicePool = Math.max(0, baseSkillValue + baseBonusDice + traitBonusDice)

    const roll = rollDice(dicePool)

    const check = resolveCheck(roll, action.difficulty)

    const resolution: InteractionResolution = {
      actor,
      target,
      action,
      dicePool,
      roll,
      check,
      appliedTraitModifiers,
    }

    this.eventBus.emit("interaction.resolved", resolution)

    if (check.outcome === "success") {
      this.eventBus.emit("interaction.succeeded", resolution)
    } else {
      this.eventBus.emit("interaction.failed", resolution)
    }

    if (check.isCriticalSuccess) {
      this.eventBus.emit("interaction.criticalSuccess", resolution)
    }

    if (check.hasComplication) {
      this.eventBus.emit("interaction.complication", resolution)
    }

    return resolution
  }

  private getAppliedTraitModifiers(
    actor: Character,
    action: InteractionAction,
  ): TraitModifier[] {
    const traitModifiers = action.traitModifiers ?? []

    return traitModifiers.filter((modifier) =>
      hasTrait(actor, modifier.trait),
    )
  }
}

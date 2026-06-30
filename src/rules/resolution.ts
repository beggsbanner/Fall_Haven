import type { RollResult } from "./dice"
import type { Difficulty } from "./difficulty"
import { getRequiredSuccesses } from "./difficulty"

export type CheckOutcome = "success" | "failure"

export type CheckResolution = {
  outcome: CheckOutcome
  difficulty: Difficulty
  requiredSuccesses: number
  successes: number
  crits: number
  complications: number
  margin: number
  isCriticalSuccess: boolean
  hasComplication: boolean
  roll: RollResult
}

export function resolveCheck(
  roll: RollResult,
  difficulty: Difficulty,
): CheckResolution {
  const requiredSuccesses = getRequiredSuccesses(difficulty)
  const margin = roll.successes - requiredSuccesses
  const succeeded = roll.successes >= requiredSuccesses

  return {
    outcome: succeeded ? "success" : "failure",
    difficulty,
    requiredSuccesses,
    successes: roll.successes,
    crits: roll.crits,
    complications: roll.complications,
    margin,
    isCriticalSuccess: succeeded && roll.crits > 0,
    hasComplication: !succeeded && roll.complications > 0,
    roll,
  }
}

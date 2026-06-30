export type DieValue = 1 | 2 | 3 | 4 | 5 | 6

export type RollOptions = {
  successThreshold?: number
  criticalValue?: number
  complicationValue?: number
}

export type RollResult = {
  pool: number
  rolls: DieValue[]
  successes: number
  crits: number
  complications: number
  highest: DieValue | null
  lowest: DieValue | null
}

const DEFAULT_SUCCESS_THRESHOLD = 4
const DEFAULT_CRITICAL_VALUE = 6
const DEFAULT_COMPLICATION_VALUE = 1

function rollD6(): DieValue {
  return (Math.floor(Math.random() * 6) + 1) as DieValue
}

export function rollDice(pool: number, options: RollOptions = {}): RollResult {
  const safePool = Math.max(0, Math.floor(pool))

  const successThreshold =
    options.successThreshold ?? DEFAULT_SUCCESS_THRESHOLD

  const criticalValue = options.criticalValue ?? DEFAULT_CRITICAL_VALUE

  const complicationValue =
    options.complicationValue ?? DEFAULT_COMPLICATION_VALUE

  const rolls: DieValue[] = []

  for (let i = 0; i < safePool; i += 1) {
    rolls.push(rollD6())
  }

  const successes = rolls.filter((roll) => roll >= successThreshold).length
  const crits = rolls.filter((roll) => roll === criticalValue).length
  const complications = rolls.filter(
    (roll) => roll === complicationValue,
  ).length

  return {
    pool: safePool,
    rolls,
    successes,
    crits,
    complications,
    highest: rolls.length > 0 ? (Math.max(...rolls) as DieValue) : null,
    lowest: rolls.length > 0 ? (Math.min(...rolls) as DieValue) : null,
  }
}

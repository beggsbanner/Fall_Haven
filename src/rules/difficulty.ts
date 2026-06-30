export type Difficulty =
  | "trivial"
  | "easy"
  | "normal"
  | "hard"
  | "epic"
  | "legendary"

export const DIFFICULTY_SUCCESS_REQUIREMENTS: Record<Difficulty, number> = {
  trivial: 0,
  easy: 1,
  normal: 2,
  hard: 3,
  epic: 4,
  legendary: 5,
}

export function getRequiredSuccesses(difficulty: Difficulty): number {
  return DIFFICULTY_SUCCESS_REQUIREMENTS[difficulty]
}

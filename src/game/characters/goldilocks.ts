import type { Character } from "../../entities/Character"

export const goldilocks: Character = {
  id: "goldilocks",
  name: "Goldilocks",
  species: "human",

  roles: ["sneaky_sneak_thief"],
  traits: ["curious", "brave", "playful"],

  stats: {
    strength: 1,
    agility: 3,
    wit: 2,
    heart: 3,
    instinct: 3,
    charm: 2,
  },

  skills: {
    melee: 1,
    ranged: 2,
    magic: 0,
    sneak: 3,
    craft: 2,
    repair: 1,
    knowledge: 1,
    survival: 2,
    perception: 3,
    charm: 2,
    humor: 1,
    intimidate: 0,
    beastmastery: 2,
  },

  resources: {
    health: { current: 10, max: 10 },
    mana: { current: 0, max: 0 },
    stamina: { current: 10, max: 10 },
  },

  abilities: ["sneak", "inspect", "quick_escape"],
  inventory: ["stuffed_frog", "cookies", "rope"],

  state: "active",
}

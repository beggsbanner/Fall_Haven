import type { Character } from "../../entities/Character"

export const dad: Character = {
  id: "dad",
  name: "Dad",
  species: "human",

  roles: ["bard", "support"],
  traits: ["humorous", "laid_back"],

  stats: {
    strength: 2,
    agility: 2,
    wit: 2,
    heart: 4,
    instinct: 2,
    charm: 3,
  },

  skills: {
    melee: 2,
    ranged: 1,
    magic: 1,
    sneak: 1,
    craft: 1,
    repair: 1,
    knowledge: 1,
    survival: 2,
    perception: 2,
    charm: 3,
    humor: 4,
    intimidate: 1,
    beastmastery: 1,
  },

  resources: {
    health: { current: 12, max: 12 },
    mana: { current: 4, max: 4 },
    stamina: { current: 10, max: 10 },
  },

  abilities: ["dad_joke", "morale_boost", "lute_play"],
  inventory: ["lute_piw", "snacks"],

  state: "active",
}

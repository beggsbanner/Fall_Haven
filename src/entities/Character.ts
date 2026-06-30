export type StatName =
  | "strength"
  | "agility"
  | "wit"
  | "heart"
  | "instinct"
  | "charm"

export type SkillName =
  | "melee"
  | "ranged"
  | "magic"
  | "sneak"
  | "craft"
  | "repair"
  | "knowledge"
  | "survival"
  | "perception"
  | "charm"
  | "humor"
  | "intimidate"
  | "beastmastery"

export type ResourceName = "health" | "mana" | "stamina"

export type CharacterStats = Record<StatName, number>

export type CharacterSkills = Record<SkillName, number>

export type CharacterResources = Record<
  ResourceName,
  {
    current: number
    max: number
  }
>

export type CharacterState =
  | "available"
  | "active"
  | "inactive"
  | "retired"
  | "captured"
  | "missing"
  | "story_locked"

export type Character = {
  id: string
  name: string
  species?: string

  roles: string[]
  traits: string[]

  stats: CharacterStats
  skills: CharacterSkills
  resources: CharacterResources

  abilities: string[]
  inventory: string[]

  state: CharacterState
}

export function createEmptyStats(): CharacterStats {
  return {
    strength: 1,
    agility: 1,
    wit: 1,
    heart: 1,
    instinct: 1,
    charm: 1,
  }
}

export function createEmptySkills(): CharacterSkills {
  return {
    melee: 1,
    ranged: 1,
    magic: 1,
    sneak: 1,
    craft: 1,
    repair: 1,
    knowledge: 1,
    survival: 1,
    perception: 1,
    charm: 1,
    humor: 1,
    intimidate: 1,
    beastmastery: 1,
  }
}

export function createDefaultResources(
  health = 10,
  mana = 0,
  stamina = 10,
): CharacterResources {
  return {
    health: {
      current: health,
      max: health,
    },
    mana: {
      current: mana,
      max: mana,
    },
    stamina: {
      current: stamina,
      max: stamina,
    },
  }
}

export function getSkillValue(character: Character, skill: SkillName): number {
  return character.skills[skill] ?? 0
}

export function hasTrait(character: Character, trait: string): boolean {
  return character.traits.includes(trait)
}

export function hasRole(character: Character, role: string): boolean {
  return character.roles.includes(role)
}

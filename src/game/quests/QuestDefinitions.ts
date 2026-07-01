import type { SideQuest } from "../../core/SideQuest"

export const rabbitRescueQuest: SideQuest = {
  id: "rabbit_rescue",
  title: "Survive the Rabbit Panic",
  description:
    "A panicked pack of wild rabbits surges through the woods. Keep Dad calm and guide the pair safely to shelter while the whole thing plays out like a ridiculous bull run.",
  offeredAtChapter: 1,
  status: "available",
  objectives: [
    {
      id: "calm_dad_for_rabbits",
      description:
        "Succeed at calming Dad during the storm so you can drive him on like a crazy bull through the rabbit chaos.",
      type: "interaction",
      actionId: "calm_dad_in_storm",
      requiredOutcome: "success",
    },
  ],
  rewards: {
    pageFragments: 1,
    echoes: 1,
    threads: {
      bond: 1,
      humor: 1,
    },
  },
}

export const quests: SideQuest[] = [rabbitRescueQuest]

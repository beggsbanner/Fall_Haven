import type { Interface } from "readline"
import type { QuestManager } from "../../core/QuestManager"
import type { SideQuest } from "../../core/SideQuest"

export function promptChoice(
  rl: Interface,
  prompt: string,
  options: string[],
): Promise<number> {
  return new Promise((resolve) => {
    const ask = () => {
      console.log(prompt)
      options.forEach((option, index) => {
        console.log(`  [${index + 1}] ${option}`)
      })
      rl.question(`Choose 1-${options.length}: `, (answer) => {
        const choice = Number(answer.trim())

        if (choice >= 1 && choice <= options.length) {
          resolve(choice)
        } else {
          console.log("Please enter a valid choice number.\n")
          ask()
        }
      })
    }

    ask()
  })
}

export async function promptChoiceWithJournal(
  rl: Interface,
  prompt: string,
  options: string[],
  journalCallback: () => void,
): Promise<number> {
  return new Promise((resolve) => {
    const ask = () => {
      console.log(`${prompt} (type 'journal' to review your quest journal)`)
      options.forEach((option, index) => {
        console.log(`  [${index + 1}] ${option}`)
      })
      rl.question(`Choose 1-${options.length}: `, (answer) => {
        const trimmed = answer.trim()
        if (trimmed.toLowerCase() === "journal") {
          journalCallback()
          ask()
          return
        }

        const choice = Number(trimmed)
        if (choice >= 1 && choice <= options.length) {
          resolve(choice)
        } else {
          console.log("Please enter a valid choice number or type 'journal'.\n")
          ask()
        }
      })
    }

    ask()
  })
}

export async function promptContinueOrJournal(
  rl: Interface,
  journalCallback: () => void,
): Promise<void> {
  return new Promise((resolve) => {
    const ask = () => {
      rl.question(
        "Press Enter to continue, or type 'journal' to review your journal: ",
        (answer) => {
          const trimmed = answer.trim().toLowerCase()
          if (trimmed === "journal") {
            journalCallback()
            ask()
            return
          }
          resolve()
        },
      )
    }

    ask()
  })
}

function formatQuest(quest: SideQuest): string {
  const objectives = quest.objectives
    .map((objective) => {
      const status = objective.status ?? "pending"
      const progress = objective.requiredProgress
        ? ` (${objective.progress}/${objective.requiredProgress})`
        : ""
      return `    - ${objective.description} [${status}]${progress}`
    })
    .join("\n")

  return [
    `  • ${quest.title} (${quest.status})`,
    `    ${quest.description}`,
    objectives,
  ].join("\n")
}

export function printQuestJournal(questManager: QuestManager): void {
  const active = questManager.getActiveQuests()
  const available = questManager.getAvailableQuests()
  const completed = questManager.getCompletedQuests()
  const failed = questManager.getFailedQuests()

  if (!active.length && !available.length && !completed.length && !failed.length) {
    return
  }

  console.log("\n📓 Quest Journal")

  if (active.length) {
    console.log("\nActive Quests:")
    active.forEach((quest) => console.log(formatQuest(quest)))
  }

  if (available.length) {
    console.log("\nAvailable Quests:")
    available.forEach((quest) => console.log(formatQuest(quest)))
  }

  if (completed.length) {
    console.log("\nCompleted Quests:")
    completed.forEach((quest) => console.log(formatQuest(quest)))
  }

  if (failed.length) {
    console.log("\nFailed Quests:")
    failed.forEach((quest) => console.log(formatQuest(quest)))
  }

  console.log("")
}

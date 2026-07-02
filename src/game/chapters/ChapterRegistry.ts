import type { Chapter, Scene, SceneOutcome } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"
import { Chapter1 } from "./Chapter1"
import { Chapter2 } from "./Chapter2"
import { Chapter3 } from "./Chapter3"
import { Chapter4 } from "./Chapter4"
import { Chapter5 } from "./Chapter5"
import { Chapter6 } from "./Chapter6"
import { Chapter7 } from "./Chapter7"
import { Chapter8 } from "./Chapter8"
import { Chapter9 } from "./Chapter9"
import { Chapter10 } from "./Chapter10"
import { Chapter11 } from "./Chapter11"
import { Chapter12 } from "./Chapter12"
import { Chapter13 } from "./Chapter13"
import { Chapter14 } from "./Chapter14"
import { Chapter15 } from "./Chapter15"
import { Chapter16 } from "./Chapter16"
import { Chapter17 } from "./Chapter17"
import { Chapter18 } from "./Chapter18"
import { Chapter19 } from "./Chapter19"
import { Chapter20 } from "./Chapter20"
import { Chapter21 } from "./Chapter21"
import { Chapter22 } from "./Chapter22"
import { Chapter23 } from "./Chapter23"
import { Chapter24 } from "./Chapter24"
import { Chapter25 } from "./Chapter25"
import { Chapter26 } from "./Chapter26"
import { Chapter27 } from "./Chapter27"
import { Chapter28 } from "./Chapter28"
import { Chapter29 } from "./Chapter29"
import { Chapter30 } from "./Chapter30"
import { Chapter31 } from "./Chapter31"
import { Chapter32 } from "./Chapter32"
import { Chapter33 } from "./Chapter33"
import { Chapter34 } from "./Chapter34"
import { Chapter35 } from "./Chapter35"
import { Chapter36 } from "./Chapter36"
import { Chapter99 } from "./Chapter99"
import { loadBookChapters } from "./BookChapterLoader"
// Future expansion: Book 2 chapter loader can be added here when the next story arc is ready.

const actTitles = [
  "Wonder",
  "The Road",
  "Home & Preparation",
  "War & Aftermath",
]

function getActTitle(chapter: number): string {
  if (chapter >= 1 && chapter <= 4) {
    return actTitles[0]
  }

  if (chapter >= 5 && chapter <= 14) {
    return actTitles[1]
  }

  if (chapter >= 15 && chapter <= 24) {
    return actTitles[2]
  }

  return actTitles[3]
}

function getActTone(chapter: number): NarrationLine["style"] {
  if (chapter >= 1 && chapter <= 4) {
    return "curious"
  }

  if (chapter >= 5 && chapter <= 14) {
    return "playful"
  }

  if (chapter >= 15 && chapter <= 24) {
    return "calm"
  }

  return "tense"
}

function getPrimaryThread(chapter: number) {
  if (chapter >= 1 && chapter <= 4) {
    return "curiosity"
  }

  if (chapter >= 5 && chapter <= 14) {
    return "bond"
  }

  if (chapter >= 15 && chapter <= 24) {
    return "bond"
  }

  return "fear"
}

function createPlaceholderScene(chapter: number): Scene {
  return {
    id: `ch${chapter}_placeholder_scene`,
    title: `Chapter ${chapter} Placeholder`,
    narration: [
      {
        text: `This placeholder scene represents Chapter ${chapter} of Act ${getActTitle(chapter)}. The journey continues with a new beat, a choice, and room for future story detail.`,
        style: getActTone(chapter),
      },
    ],
    execute: async (runtime: GameRuntime) => {
      const primaryThread = getPrimaryThread(chapter)
      runtime.story.gainThread(primaryThread, 1)
      runtime.story.gainPageFragment(1)

      console.log(`\n📘 Chapter ${chapter} placeholder scene plays out.`)
      console.log(`⟫ Story thread ${primaryThread} advances.`)
      console.log(runtime.story.getSummary())

      return "neutral"
    },
  }
}

function createPlaceholderChapter(chapter: number): Chapter {
  const actTitle = getActTitle(chapter)
  const chapterTitle = `Chapter ${chapter}: ${actTitle} Moment`

  return {
    number: chapter,
    title: chapterTitle,
    scenes: [createPlaceholderScene(chapter)],
    run: async (runtime: GameRuntime) => {
      console.log("\n" + "=".repeat(60))
      console.log(`📕 CHAPTER ${chapter}: ${chapterTitle}`)
      console.log("=".repeat(60))

      const scene = createPlaceholderScene(chapter)
      console.log(`\n--- ${scene.title} ---\n`)
      scene.narration.forEach((line) => console.log(`  ${line.text}`))
      await scene.execute(runtime)

      console.log("\n" + "=".repeat(60))
      console.log(`📝 End of Chapter ${chapter}`)
      console.log("Story Tone:", runtime.story.getStoryTone())
      console.log("Story Summary:", runtime.story.getSummary())
      console.log("=".repeat(60) + "\n")
    },
  }
}

const bookChapters = loadBookChapters().filter(
  (chapter) =>
    chapter.number !== 1 &&
    chapter.number !== 2 &&
    chapter.number !== 3 &&
    chapter.number !== 4 &&
    chapter.number !== 5 &&
    chapter.number !== 6 &&
    chapter.number !== 7 &&
    chapter.number !== 8 &&
    chapter.number !== 9 &&
    chapter.number !== 10 &&
    chapter.number !== 11 &&
    chapter.number !== 12 &&
    chapter.number !== 13 &&
    chapter.number !== 14 &&
    chapter.number !== 15 &&
    chapter.number !== 16 &&
    chapter.number !== 17 &&
    chapter.number !== 18 &&
    chapter.number !== 19 &&
    chapter.number !== 20 &&
    chapter.number !== 21 &&
    chapter.number !== 22 &&
    chapter.number !== 23 &&
    chapter.number !== 24 &&
    chapter.number !== 25 &&
    chapter.number !== 26 &&
    chapter.number !== 27 &&
    chapter.number !== 28 &&
    chapter.number !== 29 &&
    chapter.number !== 30 &&
    chapter.number !== 31 &&
    chapter.number !== 32 &&
    chapter.number !== 33 &&
    chapter.number !== 34 &&
    chapter.number !== 35 &&
    chapter.number !== 36 &&
    chapter.number !== 99,
)

export const chapters: Chapter[] = [
  Chapter1,
  Chapter2,
  Chapter3,
  Chapter4,
  Chapter5,
  Chapter6,
  Chapter7,
  Chapter8,
  Chapter9,
  Chapter10,
  Chapter11,
  Chapter12,
  Chapter13,
  Chapter14,
  Chapter15,
  Chapter16,
  Chapter17,
  Chapter18,
  Chapter19,
  Chapter20,
  Chapter21,
  Chapter22,
  Chapter23,
  Chapter24,
  Chapter25,
  Chapter26,
  Chapter27,
  Chapter28,
  Chapter29,
  Chapter30,
  Chapter31,
  Chapter32,
  Chapter33,
  Chapter34,
  Chapter35,
  Chapter36,
  Chapter99,
  ...bookChapters,
]

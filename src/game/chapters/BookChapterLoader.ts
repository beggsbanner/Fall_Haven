import { readFileSync } from "fs"
import { join } from "path"
import type { Chapter, Scene } from "../../core/Chapter"
import type { GameRuntime } from "../../core/GameRuntime"
import type { NarrationLine } from "../../core/NarrationSystem"

type RawBookChapter = {
  number: number
  title: string
  paragraphs: string[]
}

const BOOK_FILE_NAME = "Fall Haven_ A Fairly Odd Story.txt"

function normalizeTextLine(line: string): string {
  return line.replace(/\[[^\]]+\]/g, "").trim()
}

function splitParagraphIntoNarration(paragraph: string): NarrationLine[] {
  const lines: NarrationLine[] = []
  const sentencePattern = /([^.!?]+[.!?])/g
  const quotePattern = /(?:([A-Za-z' ]+?)\s*(?:said|asked|replied|added|urged|shouted|exclaimed|whispered|muttered|called|laughed)\s*[,;:]?\s*)?[“\"]([^“\"]+?)[”\"]/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = quotePattern.exec(paragraph))) {
    const before = paragraph.slice(lastIndex, match.index).trim()
    if (before) {
      const sentences = before.match(sentencePattern) ?? [before]
      sentences.forEach((sentence) => {
        const text = sentence.trim()
        if (text) {
          lines.push({ text, style: "calm" })
        }
      })
    }

    const quoteText = match[2].trim()
    const speakerHint = match[1]?.trim()
    const afterStart = match.index + match[0].length
    const after = paragraph.slice(afterStart, afterStart + 80).trim()
    const speaker = speakerHint || extractSpeaker(before) || extractSpeaker(after)

    lines.push({ text: quoteText, style: "playful", speaker })
    lastIndex = match.index + match[0].length
  }

  const remainder = paragraph.slice(lastIndex).trim()
  if (remainder) {
    const sentences = remainder.match(sentencePattern) ?? [remainder]
    sentences.forEach((sentence) => {
      const text = sentence.trim()
      if (text) {
        lines.push({ text, style: "calm" })
      }
    })
  }

  return lines
}

function extractSpeaker(text: string): string | undefined {
  const endSpeaker = text.match(/([A-Za-z' ]+?)\s+(?:said|asked|replied|added|urged|shouted|exclaimed|whispered|muttered|called|laughed)\s*[,;:]?$/i)
  if (endSpeaker) {
    return endSpeaker[1].trim()
  }

  const startSpeaker = text.match(/^(?:["“][^"”]+["”]\s*,?\s*)?(?:said|asked|replied|added|urged|shouted|exclaimed|whispered|muttered|called|laughed)\s+([A-Za-z' ]+?)\s*[,;:]?$/i)
  if (startSpeaker) {
    return startSpeaker[1].trim()
  }

  const introMatch = text.match(/^(\w+?)\s*(?:said|asked|replied|added|urged|shouted|exclaimed|whispered|muttered|called|laughed)/i)
  if (introMatch) {
    return introMatch[1].trim()
  }

  const speakerMatch = text.match(/([A-Za-z' ]+?)\s+(?:said|asked|replied|added|urged|shouted|exclaimed|whispered|muttered|called|laughed)/i)
  return speakerMatch ? speakerMatch[1].trim() : undefined
}

function parseBookChapters(): RawBookChapter[] {
  const filePath = join(process.cwd(), BOOK_FILE_NAME)
  const rawText = readFileSync(filePath, "utf-8")
  const lines = rawText.split(/\r?\n/)

  const chapters: RawBookChapter[] = []
  let currentChapter: RawBookChapter | null = null
  let paragraphLines: string[] = []

  const flushParagraph = () => {
    if (currentChapter && paragraphLines.length) {
      const paragraph = paragraphLines.join(" ")
      currentChapter.paragraphs.push(normalizeTextLine(paragraph))
      paragraphLines = []
    }
  }

  const headerRegex = /^Chapter\s+(\d+)\s*:\s*(.+)$/i
  const epilogueRegex = /^Epilogue\s*:\s*(.*)$/i

  for (const rawLine of lines) {
    const line = rawLine.trim()
    if (!line) {
      flushParagraph()
      continue
    }

    const headerMatch = line.match(headerRegex)
    const epilogueMatch = line.match(epilogueRegex)

    if (headerMatch) {
      flushParagraph()
      if (currentChapter) {
        chapters.push(currentChapter)
      }

      currentChapter = {
        number: Number(headerMatch[1]),
        title: headerMatch[2].trim(),
        paragraphs: [],
      }
      continue
    }

    if (epilogueMatch) {
      flushParagraph()
      if (currentChapter) {
        chapters.push(currentChapter)
      }

      currentChapter = {
        number: 99,
        title: epilogueMatch[1].trim() || "Epilogue",
        paragraphs: [],
      }
      continue
    }

    if (currentChapter) {
      paragraphLines.push(line)
    }
  }

  flushParagraph()
  if (currentChapter) {
    chapters.push(currentChapter)
  }

  return chapters
}

function createChapterScene(chapter: RawBookChapter, sceneParagraphs: string[], sceneIndex: number, totalScenes: number): Scene {
  const narrationLines: NarrationLine[] = []

  for (const paragraph of sceneParagraphs) {
    if (!paragraph) {
      continue
    }

    const lines = splitParagraphIntoNarration(paragraph)
    narrationLines.push(...lines)
  }

  return {
    id: `ch${chapter.number}_scene_${sceneIndex + 1}`,
    title: getSceneTitle(chapter.number, sceneIndex, totalScenes, chapter.title),
    narration: narrationLines,
    execute: async (runtime: GameRuntime) => {
      runtime.story.gainThread(
        chapter.number <= 4 ? "curiosity" : chapter.number <= 14 ? "bond" : chapter.number <= 24 ? "bond" : "fear",
        1,
      )
      runtime.story.gainPageFragment(1)

      console.log(`\n📘 Chapter ${chapter.number}: ${chapter.title}`)
      console.log(runtime.story.getSummary())
      return "neutral"
    },
  }
}

function getSceneTitle(chapterNumber: number, sceneIndex: number, totalScenes: number, chapterTitle: string): string {
  const chapter2SceneTitles = [
    "A Strange Cabin",
    "The Fall Haven 9",
    "Spaghetti and Dad Jokes",
  ]

  const chapter3SceneTitles = [
    "The Lepercorn Arrives",
    "The Call to Adventure",
  ]

  if (chapterNumber === 2 && chapter2SceneTitles[sceneIndex]) {
    return chapter2SceneTitles[sceneIndex]
  }

  if (chapterNumber === 3 && chapter3SceneTitles[sceneIndex]) {
    return chapter3SceneTitles[sceneIndex]
  }

  return totalScenes > 1 ? `Part ${sceneIndex + 1}` : chapterTitle
}

function chapterTitleSafe(chapterNumber: number): string {
  return `Chapter ${chapterNumber}`
}

function splitParagraphsIntoScenes(paragraphs: string[]): string[][] {
  const groups: string[][] = []
  const maxPerScene = Math.ceil(paragraphs.length / Math.min(3, Math.max(1, Math.ceil(paragraphs.length / 5))))
  let current: string[] = []

  paragraphs.forEach((paragraph) => {
    if (!paragraph.trim()) {
      return
    }

    current.push(paragraph)
    if (current.length >= maxPerScene) {
      groups.push(current)
      current = []
    }
  })

  if (current.length) {
    groups.push(current)
  }

  return groups
}

export function loadBookChapters(): Chapter[] {
  const parsed = parseBookChapters()
  return parsed.map((chapter) => {
    const scenes = splitParagraphsIntoScenes(chapter.paragraphs).map((sceneParagraphs, sceneIndex, allScenes) =>
      createChapterScene(chapter, sceneParagraphs, sceneIndex, allScenes.length),
    )

    return {
      number: chapter.number,
      title: chapter.title,
      scenes,
      run: async (runtime: GameRuntime, rl?: unknown) => {
        console.log("\n" + "=".repeat(60))
        console.log(`📕 CHAPTER ${chapter.number}: ${chapter.title}`)
        console.log("=".repeat(60))

        for (const scene of scenes) {
          console.log(`\n--- ${scene.title} ---\n`)
          scene.narration.forEach((line) => {
            const prefix = line.speaker ? `${line.speaker}: ` : ""
            console.log(`  ${prefix}${line.text}`)
          })
          await scene.execute(runtime)
        }

        console.log("\n" + "=".repeat(60))
        console.log(`📝 End of Chapter ${chapter.number}`)
        console.log("Story Tone:", runtime.story.getStoryTone())
        console.log("Story Summary:", runtime.story.getSummary())
        console.log("=".repeat(60) + "\n")
      },
    }
  })
}

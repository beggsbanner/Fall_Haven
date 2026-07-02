const { readFileSync, writeFileSync, mkdirSync } = require("fs")
const { join } = require("path")

const ROOT = process.cwd()
const BOOK_FILE = join(ROOT, "Fall Haven_ A Fairly Odd Story.txt")
const OUTPUT_DIR = join(ROOT, "public")
const OUTPUT_FILE = join(OUTPUT_DIR, "book-data.js")

const rawText = readFileSync(BOOK_FILE, "utf-8")
const lines = rawText.split(/\r?\n/)

const chapters = []
let current = null
let paragraphLines = []

const flushParagraph = () => {
  if (current && paragraphLines.length) {
    current.paragraphs.push(paragraphLines.join(" ").trim())
    paragraphLines = []
  }
}

const headerRegex = /^Chapter\s+(\d+)\s*(?::\s*|\s+)(.*)$/i
const epilogueRegex = /^Epilogue\s*[:\-]?\s*(.*)$/i

for (const rawLine of lines) {
  const line = rawLine.trim()
  if (!line) {
    flushParagraph()
    continue
  }

  const chapterMatch = line.match(headerRegex)
  const epilogueMatch = line.match(epilogueRegex)

  if (chapterMatch) {
    flushParagraph()
    if (current) chapters.push(current)
    current = {
      number: Number(chapterMatch[1]),
      title: chapterMatch[2] || `Chapter ${chapterMatch[1]}`,
      paragraphs: [],
    }
    continue
  }

  if (epilogueMatch) {
    flushParagraph()
    if (current) chapters.push(current)
    current = {
      number: 99,
      title: epilogueMatch[1] || "Epilogue",
      paragraphs: [],
    }
    continue
  }

  if (current) {
    paragraphLines.push(line)
  }
}

flushParagraph()
if (current) chapters.push(current)

mkdirSync(OUTPUT_DIR, { recursive: true })
writeFileSync(
  OUTPUT_FILE,
  `window.bookChapters = ${JSON.stringify(chapters, null, 2)};\n`,
  "utf-8",
)

console.log(`Generated ${OUTPUT_FILE} with ${chapters.length} chapters.`)

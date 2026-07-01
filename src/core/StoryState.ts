export type StoryThreadName = "curiosity" | "humor" | "fear" | "bond"
export type StoryTone = "calm" | "curious" | "playful" | "tense" | "fractured"

export type ChapterSummary = {
  chapter: number
  title: string
  storyTone: StoryTone
  summary: ReturnType<StoryState["getSummary"]>
}

export class StoryState {
  private readonly threads = new Map<StoryThreadName, number>()
  private pageFragments = 0
  private echoes = 0
  private chapterSummaries: ChapterSummary[] = []

  gainThread(thread: StoryThreadName, amount = 1): void {
    const current = this.threads.get(thread) ?? 0
    this.threads.set(thread, current + amount)
  }

  gainPageFragment(amount = 1): void {
    this.pageFragments += amount
  }

  gainEcho(amount = 1): void {
    this.echoes += amount
  }

  getThread(thread: StoryThreadName): number {
    return this.threads.get(thread) ?? 0
  }

  getPageFragments(): number {
    return this.pageFragments
  }

  getEchoes(): number {
    return this.echoes
  }

  getStoryTone(): StoryTone {
    const fear = this.getThread("fear")
    const curiosity = this.getThread("curiosity")
    const humor = this.getThread("humor")
    const bond = this.getThread("bond")

    if (fear >= 2 && this.pageFragments >= 1) {
      return "fractured"
    }

    if (fear >= 2) {
      return "tense"
    }

    if (curiosity >= 2 && humor >= 1) {
      return "curious"
    }

    if (humor >= 2 && bond >= 1) {
      return "playful"
    }

    if (bond >= 2) {
      return "calm"
    }

    return "curious"
  }

  spendPageFragment(amount = 1): boolean {
    if (this.pageFragments < amount) {
      return false
    }

    this.pageFragments -= amount
    return true
  }

  recordChapterSummary(chapter: number, title: string): void {
    this.chapterSummaries.push({
      chapter,
      title,
      storyTone: this.getStoryTone(),
      summary: this.getSummary(),
    })
  }

  getChapterSummaries(): ChapterSummary[] {
    return [...this.chapterSummaries]
  }

  getSummary() {
    return {
      pageFragments: this.pageFragments,
      echoes: this.echoes,
      threads: {
        curiosity: this.getThread("curiosity"),
        humor: this.getThread("humor"),
        fear: this.getThread("fear"),
        bond: this.getThread("bond"),
      },
    }
  }
}

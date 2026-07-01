export type NarrationStyle = "calm" | "curious" | "playful" | "tense" | "fractured"

export interface NarrationLine {
  text: string
  style: NarrationStyle
  speaker?: string
  delay?: number
}

export class NarrationSystem {
  private narrations = new Map<string, NarrationLine[]>()

  register(key: string, lines: NarrationLine[]): void {
    this.narrations.set(key, lines)
  }

  getNarration(key: string): NarrationLine[] | undefined {
    return this.narrations.get(key)
  }

  formatNarration(lines: NarrationLine[]): string {
    return lines
      .map((line) => {
        const prefix = line.speaker ? `${line.speaker}: ` : ""
        return `[${line.style.toUpperCase()}] ${prefix}${line.text}`
      })
      .join("\n\n")
  }
}

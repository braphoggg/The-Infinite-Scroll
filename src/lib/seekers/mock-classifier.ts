import type { IClassifier } from './classifier'
import type { ClassificationResult } from '../types'

const TOPIC_KEYWORDS: Record<string, string[]> = {
  crypto: ['bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'blockchain', 'defi', 'nft', 'token', 'web3', 'solana'],
  tech: ['ai', 'artificial intelligence', 'software', 'google', 'apple', 'microsoft', 'startup', 'app', 'algorithm', 'machine learning'],
  finance: ['stock', 'market', 'invest', 'bank', 'fed', 'economy', 'inflation', 'gdp', 'trade', 'earnings', 'wall street'],
  geopolitics: ['war', 'nato', 'china', 'russia', 'ukraine', 'sanction', 'military', 'diplomacy', 'treaty', 'conflict'],
  science: ['study', 'research', 'scientist', 'discovery', 'space', 'nasa', 'physics', 'biology', 'climate', 'quantum'],
  culture: ['movie', 'film', 'music', 'art', 'book', 'celebrity', 'entertainment', 'culture', 'festival', 'award'],
}

const BIAS_KEYWORDS: Record<string, string[]> = {
  left: ['progressive', 'equality', 'social justice', 'reform', 'systemic'],
  right: ['conservative', 'tradition', 'free market', 'liberty', 'patriot'],
  conspiratorial: ['cover-up', 'they don\'t want you to know', 'wake up', 'hidden', 'secret agenda'],
  academic: ['study finds', 'peer-reviewed', 'researchers', 'evidence suggests', 'data shows'],
}

export class MockClassifier implements IClassifier {
  async classify(title: string, content: string): Promise<ClassificationResult> {
    const text = `${title} ${content}`.toLowerCase()

    // Find matching topics
    const topics: Array<{ name: string; confidence: number }> = []
    for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
      const matchCount = keywords.filter(kw => text.includes(kw)).length
      if (matchCount > 0) {
        topics.push({ name: topic, confidence: Math.min(matchCount / 3, 1) })
      }
    }
    if (topics.length === 0) {
      topics.push({ name: 'general', confidence: 0.5 })
    }
    topics.sort((a, b) => b.confidence - a.confidence)

    // Detect bias
    let biasLabel = 'center'
    let biasReasoning = 'No strong bias indicators detected.'
    for (const [bias, keywords] of Object.entries(BIAS_KEYWORDS)) {
      if (keywords.some(kw => text.includes(kw))) {
        biasLabel = bias
        biasReasoning = `Contains ${bias} perspective indicators.`
        break
      }
    }

    // Generate summary (first 200 chars of content)
    const summary = content.length > 200
      ? content.slice(0, 200).trim() + '...'
      : content || title

    // Importance based on topic match strength
    const importance = Math.min(Math.round(topics[0].confidence * 6 + 2), 10)

    return { topics, summary, biasLabel, biasReasoning, importance }
  }
}

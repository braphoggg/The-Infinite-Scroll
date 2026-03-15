import type { ClassificationResult } from '../types'

export interface IClassifier {
  classify(title: string, content: string): Promise<ClassificationResult>
}

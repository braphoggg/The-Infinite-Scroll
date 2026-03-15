import type { RawLoreItem } from '../types'

export abstract class BaseSource {
  constructor(
    public readonly sourceId: string,
    public readonly type: string,
    protected readonly url: string,
    protected readonly config: Record<string, unknown> = {}
  ) {}

  abstract poll(): Promise<RawLoreItem[]>
}

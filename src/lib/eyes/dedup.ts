import { prisma } from '../db'

export async function isDuplicate(sourceId: string, externalId?: string, url?: string): Promise<boolean> {
  if (externalId) {
    const existing = await prisma.loreItem.findUnique({
      where: { sourceId_externalId: { sourceId, externalId } },
      select: { id: true },
    })
    if (existing) return true
  }
  if (url) {
    const existing = await prisma.loreItem.findFirst({
      where: { url, sourceId },
      select: { id: true },
    })
    if (existing) return true
  }
  return false
}

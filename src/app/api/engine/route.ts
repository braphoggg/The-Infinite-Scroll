import { NextRequest, NextResponse } from 'next/server'
import { engine } from '@/lib/engine'

export async function POST(req: NextRequest) {
  const { action } = await req.json()

  switch (action) {
    case 'start':
      await engine.start()
      return NextResponse.json({ status: 'started' })
    case 'stop':
      engine.stop()
      return NextResponse.json({ status: 'stopped' })
    case 'restart':
      await engine.restart()
      return NextResponse.json({ status: 'restarted' })
    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }
}

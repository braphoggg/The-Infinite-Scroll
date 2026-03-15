export async function onRequestInit() {
  // no-op: engine is started lazily from API routes
}

export async function register() {
  if (typeof window === 'undefined') {
    const { engine } = await import('./lib/engine')
    engine.start().catch(err => {
      console.error('[Instrumentation] Failed to start engine:', err)
    })
  }
}

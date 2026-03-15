import { EyeManager } from './eyes/eye-manager'
import { SeekerManager } from './seekers/seeker-manager'

export class Engine {
  private eyeManager = new EyeManager()
  private seekerManager = new SeekerManager()
  private _running = false

  get running() { return this._running }

  async start() {
    if (this._running) return
    console.log('[Engine] Starting The Infinite Scroll...')
    await this.seekerManager.start()
    await this.eyeManager.start()
    this._running = true
    console.log('[Engine] Ready.')
  }

  stop() {
    this.eyeManager.stop()
    this.seekerManager.stop()
    this._running = false
    console.log('[Engine] Stopped.')
  }

  async restart() {
    this.stop()
    await this.start()
  }
}

// Global singleton
const globalForEngine = globalThis as unknown as { engine: Engine }
export const engine = globalForEngine.engine || new Engine()
if (process.env.NODE_ENV !== 'production') globalForEngine.engine = engine

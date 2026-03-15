import { EventEmitter } from 'events'
import type { BusEvents } from './types'

class TypedEventEmitter {
  private emitter = new EventEmitter()

  emit<K extends keyof BusEvents>(event: K, data: BusEvents[K]) {
    this.emitter.emit(event, data)
  }

  on<K extends keyof BusEvents>(event: K, listener: (data: BusEvents[K]) => void) {
    this.emitter.on(event, listener)
    return () => { this.emitter.off(event, listener) }
  }

  off<K extends keyof BusEvents>(event: K, listener: (data: BusEvents[K]) => void) {
    this.emitter.off(event, listener)
  }
}

const globalForBus = globalThis as unknown as { bus: TypedEventEmitter }
export const bus = globalForBus.bus || new TypedEventEmitter()
if (process.env.NODE_ENV !== 'production') globalForBus.bus = bus

'use client'

import { useEffect, useState, useCallback } from 'react'
import { Header } from '@/components/layout/Header'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

interface Status {
  engineRunning: boolean
  totalSources: number
  activeSources: number
  totalItems: number
  itemsToday: number
  pendingItems: number
  failedItems: number
  totalTopics: number
}

export default function SettingsPage() {
  const [status, setStatus] = useState<Status | null>(null)

  const fetchStatus = useCallback(async () => {
    const res = await fetch('/api/status')
    setStatus(await res.json())
  }, [])

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 3000)
    return () => clearInterval(interval)
  }, [fetchStatus])

  const controlEngine = async (action: string) => {
    await fetch('/api/engine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    })
    fetchStatus()
  }

  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" description="System configuration and status" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Engine Control */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Engine Control</h3>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${status?.engineRunning ? 'bg-success animate-pulse' : 'bg-danger'}`} />
              <span className="text-sm text-text-secondary">
                {status?.engineRunning ? 'Running' : 'Stopped'}
              </span>
            </div>
            <div className="flex gap-2 ml-4">
              <Button variant="secondary" size="sm" onClick={() => controlEngine('start')} disabled={status?.engineRunning}>Start</Button>
              <Button variant="danger" size="sm" onClick={() => controlEngine('stop')} disabled={!status?.engineRunning}>Stop</Button>
              <Button variant="secondary" size="sm" onClick={() => controlEngine('restart')}>Restart</Button>
            </div>
          </div>
        </Card>

        {/* Stats */}
        {status && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard label="Total Sources" value={status.totalSources} sub={`${status.activeSources} active`} />
            <StatCard label="Total Items" value={status.totalItems} sub={`${status.itemsToday} today`} />
            <StatCard label="Pending" value={status.pendingItems} color={status.pendingItems > 0 ? '#fbbf24' : undefined} />
            <StatCard label="Failed" value={status.failedItems} color={status.failedItems > 0 ? '#f87171' : undefined} />
            <StatCard label="Topics" value={status.totalTopics} />
          </div>
        )}

        {/* Discord Setup Guide */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-text-primary mb-2">Discord Bot Setup</h3>
          <ol className="text-xs text-text-secondary space-y-1.5 list-decimal list-inside">
            <li>Go to <span className="text-accent">discord.com/developers/applications</span></li>
            <li>Click "New Application" and name it "The Infinite Scroll"</li>
            <li>Go to "Bot" tab, click "Add Bot", copy the token</li>
            <li>Enable "Message Content Intent" under Privileged Gateway Intents</li>
            <li>Go to "OAuth2 &gt; URL Generator", select "bot" + "applications.commands"</li>
            <li>Select permissions: Send Messages, Embed Links, Manage Channels, Read Messages</li>
            <li>Copy the generated URL and open it to invite the bot to your server</li>
            <li>Add <code className="text-accent bg-bg-primary px-1 rounded">DISCORD_TOKEN</code>, <code className="text-accent bg-bg-primary px-1 rounded">DISCORD_CLIENT_ID</code>, and <code className="text-accent bg-bg-primary px-1 rounded">DISCORD_GUILD_ID</code> to your .env.local</li>
          </ol>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: number; sub?: string; color?: string }) {
  return (
    <Card className="p-3">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="text-2xl font-bold mt-1" style={color ? { color } : undefined}>{value}</p>
      {sub && <p className="text-xs text-text-muted mt-0.5">{sub}</p>}
    </Card>
  )
}

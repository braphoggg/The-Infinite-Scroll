export const config = {
  discord: {
    token: process.env.DISCORD_TOKEN || '',
    clientId: process.env.DISCORD_CLIENT_ID || '',
    guildId: process.env.DISCORD_GUILD_ID || '',
    get enabled() { return !!this.token }
  },
  claude: {
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514',
    get enabled() { return !!this.apiKey }
  },
  engine: {
    defaultPollInterval: 300_000, // 5 minutes
    maxRequestsPerMinute: 5,
  }
}

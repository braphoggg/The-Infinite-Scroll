# The Infinite Scroll

Rather than passively consuming random news and social media, this system lets your Discord group coordinate and organize the topics you follow in one place. Content — or "lore" — is pulled from configurable sources, classified and tagged by AI, then presented through both a web dashboard and Discord channels, like a living, AI-curated group newspaper.

## Architecture

The system runs as a single Next.js process with three core components communicating through a shared SQLite database and an in-process event bus:

```
Eyes (ingest) ──→ EventBus ──→ Seekers (classify) ──→ EventBus ──→ Scrolls (present)
                                    ↕                                    ↕
                                 SQLite                            Discord API
                                                                   Web Dashboard
```

**Eyes** poll RSS feeds on configurable intervals, deduplicate content, and store raw items. **Seekers** pick up new items, classify them into topics with confidence scores, detect bias, generate summaries, and assign importance ratings (0–10). **Scrolls** present the processed lore through the web dashboard and Discord channels.

## Quick Start

```bash
git clone https://github.com/braphoggg/The-Infinite-Scroll.git
cd The-Infinite-Scroll
npm install
cp .env.example .env.local
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Discord Bot Setup

1. Create an application at [discord.com/developers](https://discord.com/developers/applications)
2. Click **New Application**, name it "The Infinite Scroll"
3. Go to **Bot** tab, click **Add Bot**, copy the token
4. Enable **Message Content Intent** under Privileged Gateway Intents
5. Go to **OAuth2 > URL Generator**, select `bot` + `applications.commands`
6. Select permissions: Send Messages, Embed Links, Manage Channels, Read Messages
7. Copy the generated URL and open it to invite the bot to your server
8. Add to `.env.local`:
   ```
   DISCORD_TOKEN=your_token
   DISCORD_CLIENT_ID=your_client_id
   DISCORD_GUILD_ID=your_guild_id
   ```

## Adding Your First Source

1. Navigate to the **Sources** page
2. Paste an RSS feed URL (e.g. `https://feeds.bbci.co.uk/news/rss.xml`)
3. Click **Add Source**
4. Watch items appear on the **Feed** page within seconds

## Dashboard

| Page | Description |
|------|-------------|
| **Feed** | Real-time scrollable feed with search, topic filters, bias labels, and importance scores |
| **Sources** | Add, remove, and toggle RSS feeds with live polling status |
| **Topics** | View and manage classification topics with color coding and item counts |
| **Settings** | Engine start/stop/restart, system stats, Discord bot setup guide |

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 16](https://nextjs.org/) | Full-stack framework |
| [React 19](https://react.dev/) | UI |
| [Tailwind CSS 4](https://tailwindcss.com/) | Styling |
| [Prisma](https://www.prisma.io/) | SQLite ORM |
| [discord.js](https://discord.js.org/) | Discord bot |
| [rss-parser](https://www.npmjs.com/package/rss-parser) | RSS/Atom feed parsing |

## Project Structure

```
src/
├── app/                    # Next.js pages + API routes
│   ├── page.tsx            # Lore Feed (home)
│   ├── sources/            # Sources management
│   ├── topics/             # Topics management
│   ├── settings/           # System settings
│   └── api/                # REST API
├── components/             # React UI components
│   ├── layout/             # Sidebar, Header
│   ├── lore/               # LoreCard, LoreFeed, LoreFilters
│   ├── sources/            # SourceCard, SourceForm
│   ├── topics/             # TopicBadge, TopicForm
│   └── ui/                 # Button, Card, Input, Badge, Modal
└── lib/                    # Core engine
    ├── engine.ts           # Singleton orchestrator
    ├── bus.ts              # Typed EventEmitter
    ├── eyes/               # Content ingestion
    ├── seekers/            # Content classification
    └── scrolls/            # Discord presentation
```

## License

[MIT](LICENSE)

# The Infinite Scroll

AI-powered lore aggregation system for Discord communities. Three autonomous components work together: **Eyes** pull content from RSS feeds & web sources, **Seekers** classify, tag, and detect bias using AI, and **Scrolls** present curated intelligence through Discord channels and a real-time dark-themed web dashboard.

Stop doomscrolling — start lore-scrolling.

## Architecture

```
┌─────────────────────────────────────────────────┐
│                 Next.js App                      │
│                                                  │
│   Web Dashboard          API Routes              │
│   ┌────────────┐    ┌──────────────────┐         │
│   │ Feed       │    │ /api/sources     │         │
│   │ Sources    │    │ /api/lore        │         │
│   │ Topics     │    │ /api/topics      │         │
│   │ Settings   │    │ /api/status      │         │
│   └────────────┘    └────────┬─────────┘         │
│                              │                    │
│        ┌─────────────────────┼────────────┐      │
│        │           Core Engine             │      │
│        │                                   │      │
│        │  👁 Eyes  →  🪼 Seekers  →  📜 Scrolls │
│        │                                   │      │
│        │        EventBus + SQLite          │      │
│        └───────────────────────────────────┘      │
└──────────────────────────────────────────────────┘
```

### Eyes (Content Ingestion)
- Subscribes to RSS feeds, YouTube channels, and web sources
- Polls on configurable intervals with automatic deduplication
- Extensible source adapter pattern — add new source types easily

### Seekers (Content Processing)
- Classifies content into topics with confidence scores
- Detects bias (left, center, right, academic, conspiratorial, etc.)
- Generates summaries and assigns importance scores (0-10)
- Ships with a keyword-based mock classifier; swap in Claude API for production

### Scrolls (Content Presentation)
- Real-time web dashboard with dark theme
- Discord bot posts classified lore to topic-specific channels
- Filterable feed by topic, importance, bias, and source

## Quick Start

```bash
# Clone and install
git clone https://github.com/your-username/the-infinite-scroll.git
cd the-infinite-scroll
npm install

# Set up the database
cp .env.example .env.local
npx prisma db push

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Adding Your First Source

1. Navigate to the **Sources** page
2. Paste an RSS feed URL (e.g. `https://feeds.bbci.co.uk/news/rss.xml`)
3. Click **Add Source**
4. Watch items appear on the **Feed** page within seconds

## Dashboard Pages

| Page | Description |
|------|-------------|
| **Feed** | Real-time scrollable feed with search, topic filters, bias labels, and importance scores |
| **Sources** | Add, remove, and toggle RSS feeds with live polling status |
| **Topics** | View and manage classification topics with color coding and item counts |
| **Settings** | Engine start/stop/restart, system stats, Discord bot setup guide |

## Discord Bot Setup (Optional)

1. Create an application at [discord.com/developers](https://discord.com/developers/applications)
2. Add a bot and copy the token
3. Enable **Message Content Intent** under Privileged Gateway Intents
4. Generate an invite URL with `bot` + `applications.commands` scopes
5. Add to `.env.local`:
   ```
   DISCORD_TOKEN=your_token
   DISCORD_CLIENT_ID=your_client_id
   DISCORD_GUILD_ID=your_guild_id
   ```

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

## Roadmap

- [ ] Swap mock classifier for Claude API
- [ ] YouTube channel source (via RSS)
- [ ] Web scraper source (Cheerio)
- [ ] Topic suggestion engine
- [ ] Importance-based filtering per guild
- [ ] Real-time WebSocket updates on dashboard
- [ ] Discord slash commands (`/feed`, `/search`, `/topics`)

## License

[MIT](LICENSE)

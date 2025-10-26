# RandomLearn - Personalized AI English Learning Platform

A comprehensive, modern web application for personalized English learning with AI-powered lessons, gamification, and mobile-first design.

## Features

### Core Learning Features
- **Personalized Lessons**: JSON-based lessons that adapt to user skill level
- **Auto-Refresh Content**: Lessons refresh every 2 days with new content
- **Multiple Question Types**: Multiple-choice, fill-in-the-blank, listening, and speaking exercises
- **Word and Meaning Practice**: Dedicated feature for spelling test preparation with pronunciation guides
- **Progress Tracking**: Real-time XP, level progression, and daily streaks

### Authentication & Security
- **Email/Password Authentication**: Secure account creation and login
- **Supabase Integration**: Enterprise-grade backend with Row Level Security (RLS)
- **Protected Routes**: Middleware-based route protection
- **Session Management**: Automatic token refresh and session handling

### User Experience
- **Responsive Design**: Mobile-first approach with full desktop support
- **PWA Support**: Install as native app with fullscreen mode
- **Gamification**: XP rewards, level system, daily streaks, and achievements
- **Beautiful UI**: Purple gradient theme with smooth animations
- **Dark Mode Ready**: Full dark mode support

### Dashboard
- Weekly progress charts
- Quick-start lesson selection
- User statistics (XP, Level, Streak)
- Personalized recommendations

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **Backend**: Supabase (PostgreSQL, Auth, RLS)
- **AI Integration**: Vercel AI SDK with OpenAI
- **Charts**: Recharts
- **PWA**: Web App Manifest, Service Workers

## Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Vercel account (for deployment)

### Installation

1. **Clone and install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Set up Supabase**
   - Create a Supabase project
   - Run the database migration: `scripts/01-create-schema.sql`
   - Copy your Supabase URL and anon key

3. **Configure environment variables**
   Add to your Vercel project or `.env.local`:
   \`\`\`
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
   \`\`\`

4. **Run development server**
   \`\`\`bash
   npm run dev
   \`\`\`

5. **Open in browser**
   Navigate to `http://localhost:3000`

## Project Structure

\`\`\`
app/
├── auth/                    # Authentication pages
│   ├── login/
│   ├── sign-up/
│   └── sign-up-success/
├── dashboard/              # Main app dashboard
├── api/                    # API routes
│   └── lessons/
│       └── personalized/
├── layout.tsx              # Root layout with PWA config
└── page.tsx                # Auth redirect page

components/
├── personalized-lesson-view.tsx    # Lesson interface
├── word-and-meaning.tsx            # Word practice feature
├── responsive-header.tsx           # Mobile-responsive header
└── ui/                             # shadcn/ui components

lib/
├── supabase/
│   ├── client.ts           # Browser client
│   ├── server.ts           # Server client
│   └── middleware.ts       # Auth middleware
└── lesson-generator.ts     # Personalized lesson logic

scripts/
└── 01-create-schema.sql    # Database schema
\`\`\`

## Database Schema

### Tables
- **profiles**: User account information and stats
- **personalized_lessons**: JSON-based lesson content with refresh logic
- **user_progress**: Tracks answers and XP earned
- **word_meanings**: Vocabulary for spelling practice
- **achievements**: User achievements and badges

All tables use Row Level Security (RLS) for data protection.

## Key Features Explained

### Personalized Lessons
- Generated based on user difficulty level
- Stored as JSON for flexibility
- Auto-refresh every 2 days
- Difficulty scales with user progression

### Word and Meaning
- Add custom words with meanings
- Practice with reveal/hide interface
- Track mastery progress
- Pronunciation guides included

### Gamification
- XP rewards for correct answers
- Level progression (100 XP per level)
- Daily streak tracking
- Achievement system

### PWA Capabilities
- Install on home screen
- Fullscreen mode support
- Offline support via service worker
- Native app-like experience

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables
4. Deploy with one click

\`\`\`bash
vercel deploy
\`\`\`

## Security

- All data protected by Supabase RLS policies
- Authentication via Supabase Auth
- Secure session management
- No sensitive data in client-side code
- HTTPS enforced in production

## Performance

- Server-side rendering for fast initial load
- Optimized images and assets
- Efficient database queries with indexes
- Service worker caching strategy
- Responsive design for all devices

## Future Enhancements

- Google OAuth integration
- AI-powered speaking practice with voice recognition
- Leaderboards and social features
- Advanced analytics dashboard
- Mobile app versions (iOS/Android)
- Offline lesson content
- Multi-language support

## Support

For issues or questions:
1. Check the documentation
2. Review example code in `user_read_only_context`
3. Contact support at vercel.com/help

## License

MIT License - feel free to use this project for learning and development.

---

Built with Next.js, Supabase, and Vercel. Designed for seamless, personalized English learning.

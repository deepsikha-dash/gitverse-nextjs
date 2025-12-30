# GitVerse Next.js

Transform Git repositories into interactive visual knowledge graphs with AI-powered insights - built with Next.js 14.

## 🚀 Features

- **Repository Structure Visualization** - Interactive tree graphs of entire repository structure
- **Branch & Commit Graph Engine** - Visualize all branches, commits, and merges
- **Contributor Intelligence System** - Visual mapping of contributor activities and patterns
- **AI-Powered Repository Assistant** - Natural language queries powered by Gemini AI
- **Coding Standards Analysis** - Automated analysis of naming conventions and best practices
- **Multi-Platform Support** - Works with GitHub, GitLab, and Bitbucket

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Frontend:** React 18, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** PostgreSQL with Prisma ORM (NeonDB)
- **AI:** Google Gemini AI
- **Visualizations:** D3.js, Recharts
- **Icons:** Lucide React
- **Authentication:** JWT with bcrypt

## 📦 Installation

1. Navigate to the project directory:

```bash
cd gitverse-nextjs
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your configuration:

- `DATABASE_URL` - NeonDB PostgreSQL connection string
- `JWT_SECRET` - Secret key for JWT token generation
- `GEMINI_API_KEY` - Google Gemini AI API key
- GitHub/GitLab/Bitbucket API tokens (optional for integration features)

4. Set up the database:

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
gitverse-nextjs/
├── app/
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── repositories/    # Repository management
│   │   ├── ai/              # AI-powered features
│   │   ├── users/           # User management
│   │   └── integrations/    # Git platform integrations
│   ├── (pages)/             # Page routes
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Home page
├── src/
│   ├── components/          # React components
│   │   ├── ai/              # AI components
│   │   ├── auth/            # Authentication components
│   │   ├── layout/          # Layout components
│   │   ├── repository/      # Repository components
│   │   ├── ui/              # Reusable UI components
│   │   └── visualizations/  # Data visualization components
│   ├── contexts/            # React contexts
│   ├── hooks/               # Custom React hooks
│   ├── pages/               # Page components
│   ├── services/            # API service functions
│   └── utils/               # Utility functions
├── lib/
│   ├── services/            # Backend services
│   │   ├── gitService.ts    # Git operations
│   │   ├── geminiService.ts # AI integration
│   │   └── repositoryService.ts # Repository logic
│   ├── prisma.ts            # Prisma client
│   ├── auth.ts              # Authentication utilities
│   └── middleware.ts        # Auth middleware
├── prisma/
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
└── package.json             # Dependencies
```

## 🎨 Design System

### Color Palette

- **Primary:** Deep Blue (#1E3A8A) - Professional and trustworthy
- **Secondary:** Slate Gray (#475569) - Neutral and sophisticated
- **Accent:** Electric Green (#10B981) - Active elements and success states
- **Supporting:** Orange (#F59E0B) for warnings, Red (#EF4444) for errors

### Typography

- **Headings:** Inter
- **Body:** Source Sans 3
- **Code:** JetBrains Mono

## 🧩 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run Next.js linter
- `npm run format` - Format code with Prettier
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## 🔧 API Routes

All API routes are available under `/api`:

- `/api/auth/*` - Authentication (login, signup, logout, me)
- `/api/repositories` - Repository CRUD operations
- `/api/repositories/[id]` - Specific repository operations
- `/api/repositories/[id]/stats` - Repository statistics
- `/api/repositories/[id]/analyze` - Trigger repository analysis
- `/api/ai/analyze-repository` - AI repository analysis
- `/api/ai/analyze-code` - AI code analysis
- `/api/ai/chat` - AI chat interface
- `/api/users/profile` - User profile management
- `/api/integrations/*` - Git platform integrations

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Docker

```bash
docker build -t gitverse-nextjs .
docker run -p 3000:3000 gitverse-nextjs
```

## 📝 Environment Variables

Required:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT secret key
- `GEMINI_API_KEY` - Google Gemini API key

Optional:

- `NEXT_PUBLIC_API_URL` - API URL for client-side (defaults to current domain)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting solutions
- Google for Gemini AI
- NeonDB for serverless PostgreSQL
- All contributors and users of GitVerse

---

Made with ❤️ by the GitVerse Team

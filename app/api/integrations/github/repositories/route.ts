import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware'
import { GitHubService } from '@/lib/services/githubService'

export async function POST(request: NextRequest) {
  try {
    requireAuth(request)
    const body = await request.json()
    const { token, username } = body

    if (!token) {
      return NextResponse.json({ error: 'GitHub token is required' }, { status: 400 })
    }

    const github = new GitHubService(token)
    const repositories = await github.listUserRepositories(username)

    return NextResponse.json({ repositories })
  } catch (error: any) {
    console.error('GitHub repositories error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch GitHub repositories', details: error.message },
      { status: 500 }
    )
  }
}

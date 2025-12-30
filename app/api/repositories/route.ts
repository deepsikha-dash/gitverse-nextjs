import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware'
import { repositoryService } from '@/lib/services/repositoryService'

export async function POST(request: NextRequest) {
  try {
    const user = requireAuth(request)
    const body = await request.json()
    const { name, url, description } = body

    console.log('Create repository request:', { name, url, userId: user.userId })

    if (!name || !url) {
      return NextResponse.json({ error: 'Name and URL are required' }, { status: 400 })
    }

    // Validate URL format
    const urlPattern = /^https?:\/\/.+/
    if (!urlPattern.test(url)) {
      return NextResponse.json({ error: 'Invalid repository URL' }, { status: 400 })
    }

    const repository = await repositoryService.createRepository({
      name,
      url,
      description,
      userId: user.userId,
    })

    console.log('Repository created:', repository.id)

    return NextResponse.json({ repository }, { status: 201 })
  } catch (error: any) {
    console.error('Create repository error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to create repository', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = requireAuth(request)
    const repositories = await repositoryService.listRepositories(user.userId)

    return NextResponse.json({ repositories })
  } catch (error: any) {
    console.error('List repositories error:', error)
    return NextResponse.json({ error: 'Failed to list repositories' }, { status: 500 })
  }
}

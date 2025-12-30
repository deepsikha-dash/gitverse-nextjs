import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware'
import { repositoryService } from '@/lib/services/repositoryService'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(request)
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid repository ID' }, { status: 400 })
    }

    // Verify ownership
    const repository = await repositoryService.getRepository(id, user.userId)

    if (!repository) {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 })
    }

    // Start analysis in background
    repositoryService.analyzeRepository(id).catch(console.error)

    return NextResponse.json({ message: 'Analysis started', status: 'analyzing' })
  } catch (error: any) {
    console.error('Analyze repository error:', error)
    return NextResponse.json({ error: 'Failed to start analysis' }, { status: 500 })
  }
}

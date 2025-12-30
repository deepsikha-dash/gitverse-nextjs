import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware'
import { repositoryService } from '@/lib/services/repositoryService'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(request)
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid repository ID' }, { status: 400 })
    }

    const repository = await repositoryService.getRepository(id, user.userId)

    if (!repository) {
      return NextResponse.json({ error: 'Repository not found' }, { status: 404 })
    }

    return NextResponse.json({ repository })
  } catch (error: any) {
    console.error('Get repository error:', error)
    return NextResponse.json({ error: 'Failed to get repository' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = requireAuth(request)
    const id = parseInt(params.id)

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid repository ID' }, { status: 400 })
    }

    await repositoryService.deleteRepository(id, user.userId)

    return NextResponse.json({ message: 'Repository deleted successfully' })
  } catch (error: any) {
    console.error('Delete repository error:', error)

    if (error.message === 'Repository not found') {
      return NextResponse.json({ error: error.message }, { status: 404 })
    }

    return NextResponse.json({ error: 'Failed to delete repository' }, { status: 500 })
  }
}

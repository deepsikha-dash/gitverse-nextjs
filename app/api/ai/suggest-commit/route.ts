import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/middleware'
import { geminiService } from '@/lib/services/geminiService'

export async function POST(request: NextRequest) {
  try {
    requireAuth(request)
    const body = await request.json()
    const { added, modified, deleted, diff } = body

    const suggestions = await geminiService.suggestCommitMessage({
      added: added || [],
      modified: modified || [],
      deleted: deleted || [],
      diff,
    })

    return NextResponse.json({ suggestions })
  } catch (error: any) {
    console.error('Commit suggestion error:', error)
    return NextResponse.json(
      { error: 'Failed to generate suggestions', details: error.message },
      { status: 500 }
    )
  }
}
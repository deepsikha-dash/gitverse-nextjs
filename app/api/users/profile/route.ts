import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/middleware'

export async function PUT(request: NextRequest) {
  try {
    const user = requireAuth(request)
    const body = await request.json()
    const { name, email, avatar } = body

    if (!name || !email) {
      return NextResponse.json({ message: 'Name and email are required' }, { status: 400 })
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: user.userId },
      },
    })

    if (existingUser) {
      return NextResponse.json({ message: 'Email is already in use' }, { status: 400 })
    }

    const updateData: any = { name, email }

    if (avatar && (avatar.startsWith('data:') || avatar.startsWith('http'))) {
      updateData.avatarUrl = avatar
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        createdAt: true,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error: any) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ message: 'Failed to update profile' }, { status: 500 })
  }
}

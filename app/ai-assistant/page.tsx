'use client'

import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import AIAssistant from '@/pages/AIAssistant'

export default function AIAssistantPage() {
  return (
    <ProtectedRoute>
      <AIAssistant />
    </ProtectedRoute>
  )
}

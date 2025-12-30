import {
  GitCommit,
  User,
  Calendar,
  FileText,
  Plus,
  Minus,
  ExternalLink,
  GitBranch,
} from 'lucide-react'
import { Card } from '@/components/ui'
import { useState } from 'react'

interface FileChange {
  path: string
  additions: number
  deletions: number
  type: 'added' | 'modified' | 'deleted'
}

interface Commit {
  hash: string
  shortHash: string
  author: {
    name: string
    email: string
    avatar: string
  }
  message: string
  description?: string
  timestamp: string
  branch: string
  filesChanged: number
  additions: number
  deletions: number
  fileChanges: FileChange[]
}

interface CommitHistoryProps {
  repository?: any
}

export const CommitHistory = ({ repository }: CommitHistoryProps) => {
  const [expandedCommit, setExpandedCommit] = useState<string | null>(null)

  // Use real commits from repository or empty array
  const commits: Commit[] =
    repository?.commits?.map((commit: any) => ({
      hash: commit.hash,
      shortHash: commit.shortHash,
      author: {
        name: commit.authorName,
        email: commit.authorEmail,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${commit.authorName}`,
      },
      message: commit.message,
      description: commit.description,
      timestamp: commit.committedAt,
      branch: commit.branch,
      filesChanged: commit.filesChanged || 0,
      additions: commit.additions || 0,
      deletions: commit.deletions || 0,
      fileChanges:
        commit.fileChanges?.map((fc: any) => ({
          path: fc.path,
          additions: fc.additions,
          deletions: fc.deletions,
          type: fc.changeType,
        })) || [],
    })) || []

  const defaultBranch = repository?.branches?.find((b: any) => b.isDefault)?.name || 'main'

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'added':
        return <Plus className="h-4 w-4 text-green-500" />
      case 'deleted':
        return <Minus className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-blue-500" />
    }
  }

  const toggleCommit = (hash: string) => {
    setExpandedCommit(expandedCommit === hash ? null : hash)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Commit History</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {commits.length} commits on {defaultBranch}
          </p>
        </div>
        <button className="glass px-4 py-2 rounded-lg hover:bg-white/10 transition-all duration-300 flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          All branches
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/20 to-transparent" />

        <div className="space-y-6">
          {commits.map((commit) => {
            const isExpanded = expandedCommit === commit.hash

            return (
              <div key={commit.hash} className="relative">
                {/* Timeline dot */}
                <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
                </div>

                <Card className="ml-16 glass hover:bg-white/10 transition-all duration-300">
                  <div className="p-6 cursor-pointer" onClick={() => toggleCommit(commit.hash)}>
                    {/* Commit header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={commit.author.avatar}
                            alt={commit.author.name}
                            className="w-8 h-8 rounded-full ring-2 ring-primary/20"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{commit.message}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                              <User className="h-3 w-3" />
                              <span>{commit.author.name}</span>
                              <span>•</span>
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(commit.timestamp)}</span>
                            </div>
                          </div>
                        </div>

                        {commit.description && !isExpanded && (
                          <p className="text-sm text-muted-foreground line-clamp-1 mt-2">
                            {commit.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1 text-green-500">
                          <Plus className="h-4 w-4" />
                          <span>{commit.additions}</span>
                        </div>
                        <div className="flex items-center gap-1 text-red-500">
                          <Minus className="h-4 w-4" />
                          <span>{commit.deletions}</span>
                        </div>
                        <div className="glass px-3 py-1 rounded-full font-mono text-xs">
                          {commit.shortHash}
                        </div>
                      </div>
                    </div>

                    {/* Expanded details */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-white/10 space-y-4 animate-fade-in-up">
                        {commit.description && (
                          <p className="text-sm text-muted-foreground">{commit.description}</p>
                        )}

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <GitBranch className="h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">Branch:</span>
                            <span className="font-medium">{commit.branch}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <GitCommit className="h-4 w-4 text-primary" />
                            <span className="text-muted-foreground">Hash:</span>
                            <code className="font-mono text-xs glass px-2 py-1 rounded">
                              {commit.hash}
                            </code>
                            <button className="text-primary hover:text-primary/80 transition-colors">
                              <ExternalLink className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* File changes */}
                        <div>
                          <h4 className="text-sm font-medium mb-3">
                            Changed {commit.filesChanged} file{commit.filesChanged !== 1 ? 's' : ''}
                          </h4>
                          <div className="space-y-2">
                            {commit.fileChanges.map((file, fileIndex) => (
                              <div
                                key={fileIndex}
                                className="flex items-center justify-between p-3 glass rounded-lg hover:bg-white/10 transition-colors"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  {getFileIcon(file.type)}
                                  <span className="font-mono text-sm truncate">{file.path}</span>
                                  {file.type === 'added' && (
                                    <span className="text-xs glass px-2 py-0.5 rounded-full text-green-500">
                                      new
                                    </span>
                                  )}
                                  {file.type === 'deleted' && (
                                    <span className="text-xs glass px-2 py-0.5 rounded-full text-red-500">
                                      deleted
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-3 text-xs">
                                  {file.additions > 0 && (
                                    <span className="text-green-500">+{file.additions}</span>
                                  )}
                                  {file.deletions > 0 && (
                                    <span className="text-red-500">-{file.deletions}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

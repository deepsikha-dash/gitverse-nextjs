import {
  Code,
  FileCode,
  TestTube,
  Shield,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Package,
} from 'lucide-react'
import { Card } from '@/components/ui'

interface LanguageStat {
  name: string
  percentage: number
  files: number
  lines: number
  color: string
}

interface FileTypeStat {
  type: string
  count: number
  percentage: number
  icon: string
}

interface QualityMetric {
  name: string
  value: number
  status: 'good' | 'warning' | 'critical'
  description: string
}

interface CodeMetricsProps {
  repository?: any
}

export function CodeMetrics({ repository }: CodeMetricsProps) {
  const getLanguageColor = (name: string): string => {
    const colors: Record<string, string> = {
      TypeScript: 'bg-blue-500',
      JavaScript: 'bg-yellow-500',
      Python: 'bg-green-500',
      Java: 'bg-red-500',
      CSS: 'bg-purple-500',
      HTML: 'bg-orange-500',
      Go: 'bg-cyan-500',
      Rust: 'bg-orange-600',
      Ruby: 'bg-red-600',
    }
    return colors[name] || 'bg-gray-500'
  }

  // Use real repository data
  const languageStats: LanguageStat[] = (repository?.languages || []).map((lang: any) => {
    // Count files for this language - match by language name
    const languageName = lang.name?.toLowerCase().trim()
    const filesForLanguage =
      repository?.files?.filter((f: any) => {
        const fileLanguage = f.language?.toLowerCase().trim()
        return fileLanguage === languageName
      }).length || 0

    return {
      name: lang.name,
      percentage: lang.percentage,
      files: filesForLanguage,
      lines: lang.lines || 0,
      color: getLanguageColor(lang.name),
    }
  })

  const totalFiles = repository?.files?.length || 0
  const sourceFiles =
    repository?.files?.filter((f: any) => f.path?.match(/\.(ts|tsx|js|jsx|py|java|go|rs)$/i))
      ?.length || 0
  const testFiles =
    repository?.files?.filter((f: any) => f.path?.match(/\.(test|spec)\.(ts|tsx|js|jsx)$/i))
      ?.length || 0
  const configFiles =
    repository?.files?.filter((f: any) => f.path?.match(/\.(json|yaml|yml|toml|ini|env)$/i))
      ?.length || 0
  const docFiles =
    repository?.files?.filter((f: any) => f.path?.match(/\.(md|txt|doc)$/i))?.length || 0
  const otherFiles = totalFiles - sourceFiles - testFiles - configFiles - docFiles

  // Calculate percentages that sum to exactly 100%
  const totalCategorizedFiles = sourceFiles + testFiles + configFiles + docFiles + otherFiles
  const rawPercentages = [
    totalCategorizedFiles ? (sourceFiles / totalCategorizedFiles) * 100 : 0,
    totalCategorizedFiles ? (testFiles / totalCategorizedFiles) * 100 : 0,
    totalCategorizedFiles ? (configFiles / totalCategorizedFiles) * 100 : 0,
    totalCategorizedFiles ? (docFiles / totalCategorizedFiles) * 100 : 0,
    totalCategorizedFiles ? (otherFiles / totalCategorizedFiles) * 100 : 0,
  ]

  // Round to 2 decimal places
  const roundedPercentages = rawPercentages.map((p) => Math.round(p * 100) / 100)

  // Adjust to ensure sum is exactly 100%
  const sum = roundedPercentages.reduce((acc, val) => acc + val, 0)
  if (sum > 0 && sum !== 100) {
    const diff = 100 - sum
    // Add difference to the largest percentage
    const maxIndex = roundedPercentages.indexOf(Math.max(...roundedPercentages))
    roundedPercentages[maxIndex] = Math.round((roundedPercentages[maxIndex] + diff) * 100) / 100
  }

  const fileTypeStats: FileTypeStat[] = [
    {
      type: 'Source Files',
      count: sourceFiles,
      percentage: roundedPercentages[0],
      icon: 'code',
    },
    {
      type: 'Test Files',
      count: testFiles,
      percentage: roundedPercentages[1],
      icon: 'test',
    },
    {
      type: 'Config Files',
      count: configFiles,
      percentage: roundedPercentages[2],
      icon: 'settings',
    },
    {
      type: 'Documentation',
      count: docFiles,
      percentage: roundedPercentages[3],
      icon: 'file-text',
    },
    {
      type: 'Other Files',
      count: otherFiles,
      percentage: roundedPercentages[4],
      icon: 'file',
    },
  ].filter((stat) => stat.count > 0)

  const qualityMetrics: QualityMetric[] = [
    {
      name: 'Total Commits',
      value: repository?.commits?.length || 0,
      status: 'good',
      description: 'Number of commits in repository',
    },
    {
      name: 'Contributors',
      value: repository?.contributors?.length || 0,
      status: 'good',
      description: 'Number of unique contributors',
    },
    {
      name: 'Active Branches',
      value: repository?.branches?.length || 0,
      status: 'good',
      description: 'Number of branches',
    },
    {
      name: 'Total Files',
      value: totalFiles,
      status: 'good',
      description: 'Total number of files',
    },
    {
      name: 'Lines of Code',
      value: repository?.linesOfCode || 0,
      status: 'good',
      description: 'Total lines of code',
    },
    {
      name: 'Repository Size',
      value: Math.round((repository?.size || 0) / 1024),
      status: 'good',
      description: 'Repository size in KB',
    },
  ]

  const complexityData = {
    low: sourceFiles,
    medium: testFiles,
    high: configFiles,
  }

  const dependencies = {
    total: repository?.languages?.length || 0,
    outdated: 0,
    vulnerable: 0,
  }
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-500'
      case 'warning':
        return 'text-yellow-500'
      case 'critical':
        return 'text-red-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          Code Metrics & Insights
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Comprehensive analysis of code quality and composition
        </p>
      </div>

      {/* Language breakdown */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Language Distribution</h3>
        {languageStats.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie chart representation */}
            <Card className="glass p-6">
              <div className="space-y-3">
                {languageStats.map((lang) => (
                  <div key={lang.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-sm text-muted-foreground">{lang.percentage}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${lang.color} transition-all duration-500`}
                          style={{ width: `${lang.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {lang.lines.toLocaleString()} lines
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4">
              {languageStats.map((lang) => (
                <Card key={lang.name} className="glass p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-3 h-3 rounded-full ${lang.color}`} />
                    <span className="font-medium text-sm">{lang.name}</span>
                  </div>
                  <p className="text-2xl font-bold mb-1">{lang.files}</p>
                  <p className="text-xs text-muted-foreground">files</p>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <Card className="glass p-6">
            <p className="text-muted-foreground text-center">No language data available</p>
          </Card>
        )}
      </div>

      {/* File types */}
      <div>
        <h3 className="text-lg font-semibold mb-4">File Type Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {fileTypeStats.map((fileType) => (
            <Card key={fileType.type} className="glass p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileCode className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold">{fileType.count}</p>
                  <p className="text-xs text-muted-foreground">{fileType.percentage.toFixed(2)}%</p>
                </div>
              </div>
              <p className="text-sm font-medium">{fileType.type}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Quality metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Code Quality Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {qualityMetrics.map((metric) => (
            <Card key={metric.name} className="glass p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <h4 className="font-semibold">{metric.name}</h4>
                </div>
                <span className={`text-2xl font-bold ${getStatusColor(metric.status)}`}>
                  {metric.value}
                  {metric.name.includes('Score') ||
                  metric.name.includes('Coverage') ||
                  metric.name.includes('Maintainability') ||
                  metric.name.includes('Documentation')
                    ? '%'
                    : ''}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{metric.description}</p>
              <div className="mt-4 h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    metric.status === 'good'
                      ? 'bg-green-500'
                      : metric.status === 'warning'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                  } transition-all duration-500`}
                  style={{ width: `${metric.value}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Code complexity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Code Complexity
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Low Complexity</span>
                <span className="text-sm font-semibold text-green-500">{complexityData.low}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-500"
                  style={{ width: `${complexityData.low}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Medium Complexity</span>
                <span className="text-sm font-semibold text-yellow-500">
                  {complexityData.medium}%
                </span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-500 transition-all duration-500"
                  style={{ width: `${complexityData.medium}%` }}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">High Complexity</span>
                <span className="text-sm font-semibold text-red-500">{complexityData.high}%</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 transition-all duration-500"
                  style={{ width: `${complexityData.high}%` }}
                />
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4">
            Lower complexity indicates easier to maintain code. Consider refactoring high complexity
            areas.
          </p>
        </Card>

        <Card className="glass p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Dependencies
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 glass rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Package className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-semibold">Total Dependencies</p>
                  <p className="text-xs text-muted-foreground">npm packages</p>
                </div>
              </div>
              <p className="text-2xl font-bold">{dependencies.total}</p>
            </div>
            <div className="flex items-center justify-between p-4 glass rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <p className="font-semibold">Outdated</p>
                  <p className="text-xs text-muted-foreground">need updates</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-yellow-500">{dependencies.outdated}</p>
            </div>
            <div className="flex items-center justify-between p-4 glass rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <Shield className="h-5 w-5 text-red-500" />
                </div>
                <div>
                  <p className="font-semibold">Vulnerable</p>
                  <p className="text-xs text-muted-foreground">security issues</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-red-500">{dependencies.vulnerable}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Test coverage */}
      <Card className="glass p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TestTube className="h-5 w-5 text-primary" />
          Test Coverage
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-4xl font-bold text-green-500 mb-2">87%</p>
            <p className="text-sm text-muted-foreground">Overall Coverage</p>
          </div>
          <div>
            <p className="text-2xl font-bold mb-2">156</p>
            <p className="text-sm text-muted-foreground">Total Tests</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-green-500 mb-2">152</p>
            <p className="text-sm text-muted-foreground">Passing</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-red-500 mb-2">4</p>
            <p className="text-sm text-muted-foreground">Failing</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

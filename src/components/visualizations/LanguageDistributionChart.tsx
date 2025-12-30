import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { Card } from '@/components/ui'

interface LanguageData {
  name: string
  percentage: number
  lines: number
  color: string
}

interface LanguageDistributionChartProps {
  repository?: any
}

// Generate a vibrant random color
const generateColor = (seed: string): string => {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }

  // Generate HSL color for better distribution
  const hue = Math.abs(hash) % 360
  const saturation = 60 + (Math.abs(hash >> 8) % 30) // 60-90%
  const lightness = 45 + (Math.abs(hash >> 16) % 20) // 45-65%

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export function LanguageDistributionChart({ repository }: LanguageDistributionChartProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const languageData: LanguageData[] = (repository?.languages || []).map((lang: any) => ({
    name: lang.name,
    percentage: lang.percentage,
    lines: lang.lines || 0,
    color: generateColor(lang.name),
  }))

  useEffect(() => {
    if (!svgRef.current) return

    const languageData: LanguageData[] = (repository?.languages || []).map((lang: any) => ({
      name: lang.name,
      percentage: lang.percentage,
      lines: lang.lines || 0,
      color: generateColor(lang.name),
    }))

    if (languageData.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = 400
    const height = 400
    const radius = Math.min(width, height) / 2 - 40

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`)

    // Create pie layout
    const pie = d3
      .pie<LanguageData>()
      .value((d) => d.percentage)
      .sort(null)

    // Create arc generator
    const arc = d3
      .arc<d3.PieArcDatum<LanguageData>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius)

    // Create hover arc
    const arcHover = d3
      .arc<d3.PieArcDatum<LanguageData>>()
      .innerRadius(radius * 0.6)
      .outerRadius(radius * 1.1)

    // Draw arcs
    const arcs = g
      .selectAll('.arc')
      .data(pie(languageData))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .style('cursor', 'pointer')

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', (d) => d.data.color)
      .attr('stroke', 'rgba(0,0,0,0.5)')
      .attr('stroke-width', 2)
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', (datum: any) => arcHover(datum) || '')
          .attr('stroke', 'rgba(255,255,255,0.8)')
          .attr('stroke-width', 3)

        if (tooltipRef.current) {
          const tooltip = d3.select(tooltipRef.current)
          tooltip.html(`
            <div class="space-y-1.5">
              <div class="font-semibold flex items-center gap-2 text-sm">
                <div class="w-3 h-3 rounded" style="background-color: ${d.data.color}"></div>
                ${d.data.name}
              </div>
              <div class="text-lg font-bold">${d.data.percentage.toFixed(1)}%</div>
              <div class="text-xs">${d.data.lines.toLocaleString()} lines</div>
            </div>
          `)
          tooltip
            .style('opacity', '1')
            .style('display', 'block')
            .style('left', `${event.clientX}px`)
            .style('top', `${event.clientY}px`)
        }
      })
      .on('mousemove', function (event) {
        if (tooltipRef.current) {
          d3.select(tooltipRef.current)
            .style('left', `${event.clientX}px`)
            .style('top', `${event.clientY}px`)
        }
      })
      .on('mouseleave', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', (datum: any) => arc(datum) || '')
          .attr('stroke', 'rgba(0,0,0,0.5)')
          .attr('stroke-width', 2)

        if (tooltipRef.current) {
          d3.select(tooltipRef.current).style('opacity', '0').style('display', 'none')
        }
      })

    // Animate arcs on load
    arcs
      .selectAll('path')
      .transition()
      .duration(1000)
      .attrTween('d', function (d: any) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d as any)
        return function (t) {
          return arc(interpolate(t) as any) || ''
        }
      })

    // Center text
    const centerGroup = g.append('g')

    // Calculate total lines from languages only (consistent with overview)
    const totalLines = languageData.reduce((sum, lang) => sum + lang.lines, 0)
    const formattedTotal =
      totalLines >= 1000000
        ? `${(totalLines / 1000000).toFixed(1)}M`
        : totalLines >= 1000
          ? `${(totalLines / 1000).toFixed(1)}K`
          : totalLines.toString()

    centerGroup
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .attr('fill', 'currentColor')
      .text(formattedTotal)

    centerGroup
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1em')
      .attr('font-size', '12px')
      .attr('fill', 'currentColor')
      .attr('opacity', 0.7)
      .text('Total Lines')
  }, [repository])

  return (
    <Card className="glass p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Language Distribution</h3>
        <p className="text-sm text-muted-foreground">Interactive breakdown of codebase languages</p>
      </div>
      <div className="flex items-center justify-center">
        <svg ref={svgRef} width="400" height="400" className="text-foreground" />
      </div>
      <div className="mt-4 space-y-2">
        {languageData.length > 0 ? (
          languageData.map((lang) => (
            <div key={lang.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: lang.color }} />
                <span className="text-sm font-medium">{lang.name}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground">{lang.lines.toLocaleString()} lines</span>
                <span className="font-semibold">{lang.percentage.toFixed(2)}%</span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground text-center">No language data available</p>
        )}
      </div>
      <div
        ref={tooltipRef}
        className="fixed p-4 rounded-lg pointer-events-none shadow-xl border"
        style={{
          opacity: 0,
          display: 'none',
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          color: 'white',
          zIndex: 9999,
          backdropFilter: 'blur(8px)',
          transform: 'translate(-250px, -250px)',
          left: '0px',
          top: '0px',
        }}
      />
    </Card>
  )
}

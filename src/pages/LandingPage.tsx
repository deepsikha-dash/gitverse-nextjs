import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  GitBranch,
  Network,
  Users,
  Brain,
  Code,
  Sparkles,
  ArrowRight,
  Check,
  Link2,
  Cpu,
  Eye,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import { Navbar, Footer } from '@/components/layout'
import {
  Button,
  Input,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  toast,
} from '@/components/ui'

export default function LandingPage() {
  const router = useRouter()
  const [repoUrl, setRepoUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateGitUrl = (url: string): boolean => {
    const gitUrlPattern =
      /^(https?:\/\/)?(www\.)?(github\.com|gitlab\.com|bitbucket\.org)\/[\w-]+\/[\w.-]+\/?$/i
    return gitUrlPattern.test(url.trim())
  }

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!repoUrl.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a repository URL',
        variant: 'destructive',
      })
      return
    }

    if (!validateGitUrl(repoUrl)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid GitHub, GitLab, or Bitbucket repository URL',
        variant: 'destructive',
      })
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: 'Success!',
        description: 'Repository URL validated. Redirecting to sign up...',
      })
      router.push(`/signup?repoUrl=${encodeURIComponent(repoUrl)}`)
    }, 1500)
  }

  const features = [
    {
      icon: Network,
      title: 'Repository Structure Visualization',
      description:
        'Interactive tree graph of your entire repository. Zoom, filter, and explore files with rich metadata and dependencies.',
    },
    {
      icon: GitBranch,
      title: 'Branch & Commit Graph',
      description:
        "Visualize all branches, commits, and merges on an interactive timeline. See your project's evolution at a glance.",
    },
    {
      icon: Users,
      title: 'Contributor Intelligence',
      description:
        'Map contributor activities, identify core maintainers, track code ownership, and analyze collaboration patterns.',
    },
    {
      icon: Brain,
      title: 'AI-Powered Assistant',
      description:
        'Ask questions in natural language. Get instant answers about code structure, functionality, and architecture.',
    },
    {
      icon: Code,
      title: 'Coding Standards Analysis',
      description:
        'Automated analysis of naming conventions, code style, and best practices across your entire codebase.',
    },
    {
      icon: Sparkles,
      title: 'Smart Insights',
      description:
        'Production readiness assessment, architecture pattern recognition, and intelligent recommendations.',
    },
  ]

  const howItWorks = [
    {
      icon: Link2,
      step: '01',
      title: 'Paste Repository URL',
      description: 'Enter any public GitHub, GitLab, or Bitbucket repository URL to get started.',
    },
    {
      icon: Cpu,
      step: '02',
      title: 'AI Processes & Analyzes',
      description: 'Our AI engine parses commits, branches, contributors, and code structure.',
    },
    {
      icon: Eye,
      step: '03',
      title: 'Explore Visualizations',
      description: 'Navigate interactive graphs showing repository structure and evolution.',
    },
    {
      icon: MessageSquare,
      step: '04',
      title: 'Ask Questions',
      description: 'Use natural language to query the AI about any aspect of the codebase.',
    },
  ]

  const pricingPlans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for exploring public repositories',
      features: [
        '5 repository analyses per month',
        'Basic visualization tools',
        'Commit history graph',
        'Community support',
      ],
      popular: false,
    },
    {
      name: 'Pro',
      price: '$19',
      period: 'per month',
      description: 'For developers who need deeper insights',
      features: [
        'Unlimited repository analyses',
        'Full visualization suite',
        'AI-powered assistant',
        'Contributor intelligence',
        'Code standards analysis',
        'Priority support',
      ],
      popular: true,
    },
    {
      name: 'Team',
      price: '$49',
      period: 'per month',
      description: 'Collaboration features for teams',
      features: [
        'Everything in Pro',
        'Up to 10 team members',
        'Private repository support',
        'Team dashboards',
        'Export & reporting',
        'Dedicated support',
      ],
      popular: false,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: '1.5s' }}
        />

        {/* Graph Decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
          <svg className="absolute top-20 right-10 w-64 h-64" viewBox="0 0 200 200">
            <circle cx="100" cy="40" r="8" className="fill-primary" />
            <circle cx="60" cy="100" r="8" className="fill-accent" />
            <circle cx="140" cy="100" r="8" className="fill-primary" />
            <circle cx="100" cy="160" r="8" className="fill-accent" />
            <line x1="100" y1="40" x2="60" y2="100" className="stroke-primary stroke-2" />
            <line x1="100" y1="40" x2="140" y2="100" className="stroke-primary stroke-2" />
            <line x1="60" y1="100" x2="100" y2="160" className="stroke-accent stroke-2" />
            <line x1="140" y1="100" x2="100" y2="160" className="stroke-accent stroke-2" />
          </svg>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 animate-fade-in-up">
              Transform Git Repositories into
              <span className="text-gradient"> Visual Knowledge Graphs</span>
            </h1>

            <p
              className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              Transform any Git repository into an interactive knowledge graph. Explore code
              structure, contributor patterns, and project evolution with AI assistance.
            </p>

            {/* Repository Input */}
            <form
              onSubmit={handleAnalyze}
              className="max-w-2xl mx-auto animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-xl glass glow-primary">
                <Input
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  className="flex-1 h-12 bg-background/50 border-0 text-base placeholder:text-muted-foreground/60 focus-visible:ring-primary"
                />
                <Button
                  type="submit"
                  size="lg"
                  disabled={isLoading}
                  className="h-12 px-6 bg-gradient-primary hover:opacity-90 transition-opacity font-semibold"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      Analyze Repository
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Supports GitHub, GitLab, and Bitbucket public repositories
              </p>
            </form>

            {/* Stats */}
            <div
              className="grid grid-cols-3 gap-8 mt-16 animate-fade-in-up"
              style={{ animationDelay: '0.4s' }}
            >
              {[
                { value: '10K+', label: 'Repositories Analyzed' },
                { value: '50M+', label: 'Commits Processed' },
                { value: '99.9%', label: 'Uptime' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-heading font-bold text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-radial opacity-50 pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Everything You Need to
              <span className="text-gradient"> Understand Your Code</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Powerful features designed to give you complete visibility into your repositories
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className="glass glass-hover group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="font-heading">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              How <span className="text-gradient">GitVerse</span> Works
            </h2>
            <p className="text-lg text-muted-foreground">
              From repository URL to actionable insights in seconds
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative group">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary/50 to-accent/50" />
                )}

                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl glass mb-6 group-hover:glow-primary transition-shadow">
                    <div className="relative">
                      <span className="absolute -top-6 -right-6 text-5xl font-heading font-bold text-primary/10 group-hover:text-primary/20 transition-colors">
                        {step.step}
                      </span>
                      <step.icon className="h-10 w-10 text-primary" />
                    </div>
                  </div>

                  <h3 className="text-xl font-heading font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Simple, Transparent <span className="text-gradient">Pricing</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free and scale as you grow. No hidden fees.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative glass ${plan.popular ? 'border-primary glow-primary' : 'glass-hover'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-primary rounded-full text-sm font-medium text-primary-foreground">
                    Most Popular
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="font-heading text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-heading font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full ${plan.popular ? 'bg-gradient-primary hover:opacity-90' : ''}`}
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => router.push('/signup')}
                  >
                    {plan.name === 'Free'
                      ? 'Get Started'
                      : plan.name === 'Team'
                        ? 'Contact Sales'
                        : 'Start Free Trial'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-primary opacity-10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center glass rounded-2xl p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-primary mb-6">
              <GitBranch className="h-8 w-8 text-primary-foreground" />
            </div>

            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
              Ready to Transform Your
              <span className="text-gradient"> Repository Experience?</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of developers who are already using GitVerse to understand and navigate
              their codebases.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-primary hover:opacity-90 font-semibold"
                onClick={() => router.push('/signup')}
              >
                Get Started for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

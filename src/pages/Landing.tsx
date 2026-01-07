import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { departments } from '@/data/departments';
import { useAuth } from '@/contexts/AuthContext';
import { FlaskConical, Lightbulb, LineChart, BookOpen, Sparkles, ArrowRight, CheckCircle2, Zap, Users, GraduationCap } from 'lucide-react';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  const features = [
    { icon: Lightbulb, title: 'What-If Exploration', description: 'Change parameters freely and observe real-time effects without fear of damaging equipment.' },
    { icon: LineChart, title: 'Dynamic Graphs', description: 'Interactive V-I curves, stress-strain diagrams, and trend analysis that update instantly.' },
    { icon: BookOpen, title: 'Lab Manual Integration', description: 'Complete digitization of engineering lab manuals across all major departments.' },
    { icon: Sparkles, title: 'AI Explanations', description: 'Understand the "why" behind every result with intelligent, context-aware explanations.' },
  ];

  const stats = [
    { value: '4+', label: 'Departments' },
    { value: '40+', label: 'Experiments' },
    { value: '100+', label: 'What-If Scenarios' },
    { value: '∞', label: 'Learning Possibilities' },
  ];

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.1),transparent_50%)]" />
        <div className="container relative">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm text-accent">
              <FlaskConical className="h-4 w-4" />
              Virtual Engineering Laboratory
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              <span className="block">Learn by Asking</span>
              <span className="mt-2 block text-gradient">"What If?"</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
              Transform your engineering lab experience. Explore unlimited scenarios, break virtual equipment, and learn from AI-powered insights.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Button size="lg" variant="accent" asChild className="group">
                  <Link to="/dashboard">Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
              ) : (
                <>
                  <Button size="lg" variant="accent" asChild className="group">
                    <Link to="/register">Start Learning Free <ArrowRight className="ml-2 h-5 w-5" /></Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/login">I have an account</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="rounded-xl border border-border bg-card/50 p-4 text-center backdrop-blur-sm animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="text-3xl font-bold text-accent">{stat.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Why Virtual Labs?</h2>
            <p className="mt-4 text-muted-foreground">Experience engineering principles through interactive exploration</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, i) => (
              <Card key={i} className="hover:shadow-lg hover:-translate-y-1 cursor-pointer animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <CardHeader>
                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">Multi-Department Coverage</h2>
            <p className="mt-4 text-muted-foreground">Complete lab manuals digitized for every engineering branch</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {departments.map((dept, i) => (
              <Card key={dept.id} className="border-l-4 animate-fade-in" style={{ animationDelay: `${i * 100}ms`, borderLeftColor: `hsl(var(--dept-${dept.id}))` }}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{dept.icon}</span>
                    <div>
                      <CardTitle className="text-lg">{dept.name}</CardTitle>
                      <CardDescription className="text-xs mt-0.5">{dept.fullName}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {dept.labs.map(lab => (
                      <li key={lab.id} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 mt-0.5 text-success shrink-0" />
                        <span>{lab.name}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto">
            {[
              { step: 1, icon: GraduationCap, title: 'Register & Select', desc: 'Enter your details and choose your department' },
              { step: 2, icon: Zap, title: 'Pick an Experiment', desc: 'Browse labs and select experiments to explore' },
              { step: 3, icon: Lightbulb, title: 'Ask "What If?"', desc: 'Adjust parameters, observe results, understand why' },
            ].map((item, i) => (
              <div key={i} className="text-center animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 border border-primary-foreground/20">
                  <item.icon className="h-8 w-8" />
                </div>
                <div className="mb-2 text-xs font-medium text-primary-foreground/60 uppercase tracking-wider">Step {item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-primary-foreground/70">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Users className="mx-auto h-12 w-12 text-accent mb-6" />
            <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Transform Your Lab Experience?</h2>
            <p className="text-lg text-muted-foreground mb-8">Join thousands of engineering students exploring unlimited what-if scenarios</p>
            {!isAuthenticated && (
              <Button size="lg" variant="accent" asChild className="group">
                <Link to="/register">Get Started Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

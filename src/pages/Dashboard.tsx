import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { departments, getExperimentsByLabId } from '@/data/departments';
import { BookOpen, FlaskConical, ChevronRight, CheckCircle2, LayoutDashboard, GraduationCap } from 'lucide-react';
import { StudentProgressDashboard } from '@/components/dashboard/StudentProgressDashboard';

export default function Dashboard() {
  const { student, isAuthenticated, progress } = useAuth();
  if (!isAuthenticated || !student) return <Navigate to="/login" replace />;

  const studentDept = departments.find(d => d.id === student.department);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {student.name.split(' ')[0]}!</h1>
        <p className="text-muted-foreground mt-1">{studentDept?.fullName} • Year {student.year}, Semester {student.semester}</p>
      </div>

      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="progress" className="gap-2">
            <GraduationCap className="h-4 w-4" /> My Progress
          </TabsTrigger>
          <TabsTrigger value="labs" className="gap-2">
            <LayoutDashboard className="h-4 w-4" /> Browse Labs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress">
          <StudentProgressDashboard />
        </TabsContent>

        <TabsContent value="labs" className="space-y-8">
          {studentDept && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <span>{studentDept.icon}</span> Your Department Labs
                  </h2>
                  <p className="text-sm text-muted-foreground">{studentDept.fullName}</p>
                </div>
                <Badge variant="outline" className="text-accent border-accent">Primary</Badge>
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {studentDept.labs.map((lab) => {
                  const experiments = getExperimentsByLabId(lab.id);
                  const labCompleted = experiments.filter(exp => 
                    progress.find(p => p.experimentId === exp.id && p.status === 'completed')
                  ).length;
                  return (
                    <Card key={lab.id} className="hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg">{lab.name}</CardTitle>
                          <Badge variant="secondary">{experiments.length} exp</Badge>
                        </div>
                        <CardDescription className="line-clamp-2">{lab.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                            {labCompleted}/{experiments.length} completed
                          </div>
                          <Button variant="ghost" size="sm" asChild className="group-hover:bg-secondary">
                            <Link to={`/lab/${lab.id}`}>
                              Open <ChevronRight className="h-4 w-4 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>
          )}

          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <BookOpen className="h-5 w-5" /> Explore All Departments
              </h2>
              <p className="text-sm text-muted-foreground">Access labs from any engineering branch</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {departments.map((dept) => {
                const isCurrentDept = dept.id === student.department;
                const totalExperiments = dept.labs.reduce((acc, lab) => acc + getExperimentsByLabId(lab.id).length, 0);
                return (
                  <Card 
                    key={dept.id} 
                    className={`border-l-4 transition-all ${isCurrentDept ? 'ring-2 ring-accent' : ''}`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{dept.icon}</span>
                        <div>
                          <CardTitle className="text-base">{dept.name}</CardTitle>
                          <CardDescription className="text-xs">
                            {dept.labs.length} labs • {totalExperiments} experiments
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        {dept.labs.slice(0, 2).map(lab => (
                          <Link 
                            key={lab.id} 
                            to={`/lab/${lab.id}`} 
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors text-sm"
                          >
                            <span className="truncate">{lab.name}</span>
                            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

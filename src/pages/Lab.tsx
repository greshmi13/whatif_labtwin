import { Link, Navigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getLabById, getExperimentsByLabId, getDepartmentById } from '@/data/departments';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, ArrowLeft, FlaskConical, CheckCircle2, PlayCircle, Circle } from 'lucide-react';

export default function Lab() {
  const { labId } = useParams<{ labId: string }>();
  const { isAuthenticated, progress } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const lab = labId ? getLabById(labId) : undefined;
  const experiments = labId ? getExperimentsByLabId(labId) : [];
  const department = lab ? getDepartmentById(lab.department) : undefined;

  if (!lab) return (<div className="container py-8"><div className="text-center py-20"><h1 className="text-2xl font-bold">Lab not found</h1><Button asChild className="mt-4"><Link to="/dashboard">Back to Dashboard</Link></Button></div></div>);

  const getExperimentStatus = (experimentId: string) => progress.find(p => p.experimentId === experimentId)?.status || 'not_started';
  const completedCount = experiments.filter(exp => getExperimentStatus(exp.id) === 'completed').length;

  return (
    <div className="container py-8">
      <div className="mb-8">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"><ArrowLeft className="h-4 w-4" /> Back to Dashboard</Link>
        <div className="flex items-start justify-between">
          <div><div className="flex items-center gap-3 mb-2">{department && <span className="text-3xl">{department.icon}</span>}<div><h1 className="text-3xl font-bold">{lab.name}</h1><p className="text-muted-foreground">{department?.fullName}</p></div></div><p className="text-muted-foreground mt-3 max-w-2xl">{lab.description}</p></div>
          <Badge variant="outline" className="text-lg px-4 py-2">{completedCount}/{experiments.length} completed</Badge>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {experiments.map((experiment, index) => {
          const status = getExperimentStatus(experiment.id);
          return (
            <Card key={experiment.id} className="hover:shadow-lg hover:-translate-y-1 cursor-pointer group animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {status === 'completed' && <CheckCircle2 className="h-5 w-5 text-success shrink-0" />}
                    {status === 'in_progress' && <PlayCircle className="h-5 w-5 text-warning shrink-0" />}
                    {status === 'not_started' && <Circle className="h-5 w-5 text-muted-foreground shrink-0" />}
                    <CardTitle className="text-base leading-tight">{experiment.name}</CardTitle>
                  </div>
                </div>
                <CardDescription className="line-clamp-2 mt-2">{experiment.aim}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1 mb-4">
                  {experiment.whatIfScenarios.slice(0, 2).map((scenario, i) => (<Badge key={i} variant="secondary" className="text-xs">{scenario.question.slice(0, 25)}...</Badge>))}
                  {experiment.whatIfScenarios.length > 2 && <Badge variant="outline" className="text-xs">+{experiment.whatIfScenarios.length - 2} more</Badge>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">{experiment.parameters.length} parameters</div>
                  <Button variant="accent" size="sm" asChild className="group-hover:shadow-glow"><Link to={`/experiment/${experiment.id}`}><FlaskConical className="h-4 w-4 mr-1" /> Start Lab <ChevronRight className="h-4 w-4 ml-1" /></Link></Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {experiments.length === 0 && (<Card className="text-center py-12"><CardContent><FlaskConical className="h-12 w-12 mx-auto text-muted-foreground mb-4" /><h3 className="text-lg font-semibold">No experiments available</h3><p className="text-muted-foreground">Experiments for this lab are coming soon.</p></CardContent></Card>)}
    </div>
  );
}

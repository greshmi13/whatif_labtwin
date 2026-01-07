import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  PlayCircle, 
  Clock, 
  TrendingUp, 
  Award,
  Target,
  Flame,
  Calendar,
  ChevronRight,
  Trophy,
  BookOpen
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { departments, getExperimentsByLabId, getExperimentById } from '@/data/departments';
import { useMemo } from 'react';

export function StudentProgressDashboard() {
  const { student, progress } = useAuth();
  
  if (!student) return null;

  const studentDept = departments.find(d => d.id === student.department);
  
  const stats = useMemo(() => {
    const completed = progress.filter(p => p.status === 'completed');
    const inProgress = progress.filter(p => p.status === 'in_progress');
    
    const deptExperiments = studentDept?.labs.reduce((acc, lab) => 
      acc + getExperimentsByLabId(lab.id).length, 0) || 0;
    
    const totalExperiments = departments.reduce((acc, dept) => 
      dept.labs.reduce((labAcc, lab) => labAcc + getExperimentsByLabId(lab.id).length, acc), 0);
    
    // Calculate streak (consecutive days with activity)
    const sortedProgress = [...progress]
      .filter(p => p.completedAt)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
    
    let streak = 0;
    if (sortedProgress.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let checkDate = new Date(today);
      
      for (const p of sortedProgress) {
        const completedDate = new Date(p.completedAt!);
        completedDate.setHours(0, 0, 0, 0);
        
        const diffDays = Math.floor((checkDate.getTime() - completedDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0 || diffDays === 1) {
          streak++;
          checkDate = completedDate;
        } else {
          break;
        }
      }
    }
    
    // Calculate labs progress
    const labsProgress = studentDept?.labs.map(lab => {
      const experiments = getExperimentsByLabId(lab.id);
      const completedInLab = experiments.filter(exp => 
        progress.find(p => p.experimentId === exp.id && p.status === 'completed')
      ).length;
      return {
        lab,
        total: experiments.length,
        completed: completedInLab,
        percentage: experiments.length > 0 ? Math.round((completedInLab / experiments.length) * 100) : 0
      };
    }) || [];
    
    // Recent completions
    const recentCompletions = sortedProgress.slice(0, 5).map(p => ({
      ...p,
      experiment: getExperimentById(p.experimentId)
    }));
    
    return {
      completed: completed.length,
      inProgress: inProgress.length,
      deptExperiments,
      totalExperiments,
      deptProgress: deptExperiments > 0 ? Math.round((completed.length / deptExperiments) * 100) : 0,
      streak,
      labsProgress,
      recentCompletions
    };
  }, [progress, studentDept]);

  // Achievement badges
  const achievements = useMemo(() => {
    const badges = [];
    
    if (stats.completed >= 1) badges.push({ name: 'First Steps', icon: '🎯', desc: 'Complete first experiment' });
    if (stats.completed >= 5) badges.push({ name: 'Explorer', icon: '🔬', desc: 'Complete 5 experiments' });
    if (stats.completed >= 10) badges.push({ name: 'Scientist', icon: '🧪', desc: 'Complete 10 experiments' });
    if (stats.completed >= 20) badges.push({ name: 'Expert', icon: '🏆', desc: 'Complete 20 experiments' });
    if (stats.streak >= 3) badges.push({ name: 'On Fire', icon: '🔥', desc: '3-day streak' });
    if (stats.streak >= 7) badges.push({ name: 'Dedicated', icon: '⭐', desc: '7-day streak' });
    if (stats.labsProgress.some(l => l.percentage === 100)) badges.push({ name: 'Lab Master', icon: '🎓', desc: 'Complete a full lab' });
    
    return badges;
  }, [stats]);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">experiments finished</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-500/10 to-transparent border-amber-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <PlayCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">currently working on</p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Department Progress</CardTitle>
            <Target className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.deptProgress}%</div>
            <Progress value={stats.deptProgress} className="mt-2 h-1.5" />
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{stats.streak}</div>
            <p className="text-xs text-muted-foreground">days in a row</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Labs Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Lab Progress
            </CardTitle>
            <CardDescription>Your progress across {studentDept?.name} labs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats.labsProgress.map(({ lab, total, completed, percentage }) => (
              <div key={lab.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate max-w-[200px]">{lab.name}</span>
                    {percentage === 100 && <Badge variant="default" className="text-xs">✓ Complete</Badge>}
                  </div>
                  <span className="text-sm text-muted-foreground">{completed}/{total}</span>
                </div>
                <div className="relative">
                  <Progress value={percentage} className="h-2" />
                  {percentage > 0 && percentage < 100 && (
                    <span 
                      className="absolute top-0 text-xs font-medium text-primary-foreground bg-primary px-1 rounded"
                      style={{ left: `calc(${percentage}% - 12px)`, transform: 'translateY(-100%)' }}
                    >
                      {percentage}%
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {stats.labsProgress.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No labs assigned to your department yet.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Completions
            </CardTitle>
            <CardDescription>Your latest achievements</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentCompletions.length > 0 ? (
              <div className="space-y-3">
                {stats.recentCompletions.map((item) => (
                  <div 
                    key={item.experimentId} 
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{item.experiment?.name || item.experimentId}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.completedAt && new Date(item.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/experiment/${item.experimentId}`}>
                        <ChevronRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 mx-auto text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">No completed experiments yet.</p>
                <p className="text-xs text-muted-foreground mt-1">Start experimenting to see your progress here!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
            <CardDescription>Badges you've earned</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {achievements.map((badge, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/20"
                >
                  <span className="text-xl">{badge.icon}</span>
                  <div>
                    <p className="font-medium text-sm">{badge.name}</p>
                    <p className="text-xs text-muted-foreground">{badge.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Continue Learning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {stats.labsProgress.filter(l => l.percentage < 100).slice(0, 3).map(({ lab }) => (
              <Button key={lab.id} variant="outline" asChild>
                <Link to={`/lab/${lab.id}`}>
                  Continue {lab.name} <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

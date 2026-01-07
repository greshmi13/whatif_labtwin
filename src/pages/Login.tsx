import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FlaskConical, ArrowLeft, LogIn } from 'lucide-react';

const demoAccounts = [
  { rollNumber: 'EEE001', name: 'Demo Student (EEE)', department: 'electrical' as const, year: 2, semester: 4, email: 'demo.eee@college.edu' },
  { rollNumber: 'ECE001', name: 'Demo Student (ECE)', department: 'electronics' as const, year: 3, semester: 5, email: 'demo.ece@college.edu' },
  { rollNumber: 'MECH001', name: 'Demo Student (MECH)', department: 'mechanical' as const, year: 2, semester: 3, email: 'demo.mech@college.edu' },
  { rollNumber: 'CIVIL001', name: 'Demo Student (CIVIL)', department: 'civil' as const, year: 3, semester: 6, email: 'demo.civil@college.edu' },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();
  const [rollNumber, setRollNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const demoAccount = demoAccounts.find(acc => acc.rollNumber.toLowerCase() === rollNumber.toLowerCase());
    if (demoAccount) {
      setTimeout(() => {
        login({ id: crypto.randomUUID(), ...demoAccount });
        toast({ title: 'Welcome back!', description: `Logged in as ${demoAccount.name}` });
        navigate('/dashboard');
      }, 500);
    } else {
      setTimeout(() => {
        setIsLoading(false);
        toast({ title: 'Account not found', description: 'Please register or use a demo account.', variant: 'destructive' });
      }, 500);
    }
  };

  const handleDemoLogin = (account: typeof demoAccounts[0]) => {
    setIsLoading(true);
    setTimeout(() => {
      login({ id: crypto.randomUUID(), ...account });
      toast({ title: 'Demo Login Successful', description: `Exploring as ${account.name}` });
      navigate('/dashboard');
    }, 300);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.08),transparent_50%)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to home
          </Link>
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
              <FlaskConical className="h-7 w-7" />
            </div>
          </div>
          <h1 className="text-2xl font-bold">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">Sign in to your What-If? account</p>
        </div>
        <Card className="bg-card/80 backdrop-blur-md border-border/50">
          <CardHeader>
            <CardTitle>Student Login</CardTitle>
            <CardDescription>Enter your roll number to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input id="rollNumber" placeholder="e.g., EEE001" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} required className="h-11" />
              </div>
              <Button type="submit" className="w-full h-11" disabled={isLoading}>
                {isLoading ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Signing in...</span> : <span className="flex items-center gap-2"><LogIn className="h-4 w-4" /> Sign In</span>}
              </Button>
            </form>
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or try a demo account</span></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {demoAccounts.map((account) => (
                <Button key={account.rollNumber} variant="outline" size="sm" onClick={() => handleDemoLogin(account)} disabled={isLoading} className="text-xs">
                  {account.department.toUpperCase()}
                </Button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground">
              Don't have an account? <Link to="/register" className="font-medium text-accent hover:underline">Register here</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

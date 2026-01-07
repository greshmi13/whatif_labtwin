import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { departments } from '@/data/departments';
import { Department } from '@/types';
import { FlaskConical, ArrowLeft, UserPlus } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', rollNumber: '', email: '', department: '' as Department | '', year: '', semester: '', college: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.department) {
      toast({ title: 'Department required', description: 'Please select your department', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      register({ name: formData.name, rollNumber: formData.rollNumber, email: formData.email, department: formData.department as Department, year: parseInt(formData.year), semester: parseInt(formData.semester), college: formData.college || undefined });
      toast({ title: 'Registration successful!', description: 'Welcome to What-If? Virtual Lab' });
      navigate('/dashboard');
    }, 500);
  };

  const updateField = (field: string, value: string) => setFormData(prev => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12 bg-[radial-gradient(ellipse_at_top,hsl(var(--accent)/0.08),transparent_50%)]">
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
          <h1 className="text-2xl font-bold">Create Account</h1>
          <p className="text-muted-foreground mt-1">Join What-If? Virtual Engineering Lab</p>
        </div>
        <Card className="bg-card/80 backdrop-blur-md border-border/50">
          <CardHeader>
            <CardTitle>Student Registration</CardTitle>
            <CardDescription>Enter your details to get started</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2"><Label htmlFor="name">Full Name *</Label><Input id="name" placeholder="Enter your full name" value={formData.name} onChange={(e) => updateField('name', e.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="rollNumber">Roll Number *</Label><Input id="rollNumber" placeholder="e.g., EEE2023001" value={formData.rollNumber} onChange={(e) => updateField('rollNumber', e.target.value)} required /></div>
              <div className="space-y-2"><Label htmlFor="email">Email *</Label><Input id="email" type="email" placeholder="student@college.edu" value={formData.email} onChange={(e) => updateField('email', e.target.value)} required /></div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select value={formData.department} onValueChange={(value) => updateField('department', value)}>
                  <SelectTrigger><SelectValue placeholder="Select your department" /></SelectTrigger>
                  <SelectContent>{departments.map((dept) => (<SelectItem key={dept.id} value={dept.id}><span className="flex items-center gap-2"><span>{dept.icon}</span><span>{dept.fullName}</span></span></SelectItem>))}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label htmlFor="year">Year *</Label><Select value={formData.year} onValueChange={(value) => updateField('year', value)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{[1, 2, 3, 4].map((year) => (<SelectItem key={year} value={year.toString()}>Year {year}</SelectItem>))}</SelectContent></Select></div>
                <div className="space-y-2"><Label htmlFor="semester">Semester *</Label><Select value={formData.semester} onValueChange={(value) => updateField('semester', value)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (<SelectItem key={sem} value={sem.toString()}>Semester {sem}</SelectItem>))}</SelectContent></Select></div>
              </div>
              <div className="space-y-2"><Label htmlFor="college">College (Optional)</Label><Input id="college" placeholder="Your institution name" value={formData.college} onChange={(e) => updateField('college', e.target.value)} /></div>
              <Button type="submit" className="w-full h-11 mt-6" disabled={isLoading}>
                {isLoading ? <span className="flex items-center gap-2"><span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" /> Creating account...</span> : <span className="flex items-center gap-2"><UserPlus className="h-4 w-4" /> Create Account</span>}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-4">Already have an account? <Link to="/login" className="font-medium text-accent hover:underline">Sign in here</Link></p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

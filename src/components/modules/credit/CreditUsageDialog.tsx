import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import { Separator } from '../../ui/separator';
import { 
  TrendingUp, 
  Calendar, 
  Activity,
  BarChart3,
  Clock,
  Zap,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useCreditManager } from '../../../hooks/useCreditManager';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface CreditUsageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock data for charts - in real app, this would come from the backend
const dailyUsageData = [
  { date: 'Jan 15', credits: 38 },
  { date: 'Jan 16', credits: 45 },
  { date: 'Jan 17', credits: 52 },
  { date: 'Jan 18', credits: 28 },
  { date: 'Jan 19', credits: 67 },
  { date: 'Jan 20', credits: 41 },
  { date: 'Jan 21', credits: 39 },
];

const weeklyUsageData = [
  { week: 'Week 1', credits: 285 },
  { week: 'Week 2', credits: 342 },
  { week: 'Week 3', credits: 296 },
  { week: 'Week 4', credits: 330 },
];

const operationBreakdown = [
  { operation: 'Task Generation', credits: 456, percentage: 36 },
  { operation: 'Code Analysis', credits: 342, percentage: 27 },
  { operation: 'Content Migration', credits: 285, percentage: 23 },
  { operation: 'Architecture Review', credits: 170, percentage: 14 },
];

export function CreditUsageDialog({ open, onOpenChange }: CreditUsageDialogProps) {
  const { creditData } = useCreditManager();
  const [activeTab, setActiveTab] = useState('overview');

  const usagePercentage = ((creditData.totalCredits - creditData.currentCredits) / creditData.totalCredits) * 100;
  const projectedDaysLeft = creditData.dailyAverage > 0 
    ? Math.floor(creditData.currentCredits / creditData.dailyAverage)
    : 30;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" />
            Credit Usage Analytics
          </DialogTitle>
          <DialogDescription>
            Monitor and manage your credit usage effectively.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Usage Trends</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Current Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Zap className="size-4 text-primary" />
                    Credits Remaining
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {creditData.currentCredits.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    of {creditData.totalCredits.toLocaleString()} total
                  </div>
                  <Progress value={(creditData.currentCredits / creditData.totalCredits) * 100} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="size-4 text-success" />
                    This Month Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {creditData.usedThisMonth.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-success">
                    <ArrowUp className="size-3" />
                    <span>12% vs last month</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="size-4 text-warning" />
                    Days Remaining
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {projectedDaysLeft}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    At current usage rate
                  </div>
                  {projectedDaysLeft < 7 && (
                    <Badge variant="destructive" className="mt-2 text-xs">
                      Running Low
                    </Badge>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Usage Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="size-5" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">Daily Average</div>
                    <div className="text-lg font-semibold">{creditData.dailyAverage}</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">Peak Day</div>
                    <div className="text-lg font-semibold">67</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">Low Day</div>
                    <div className="text-lg font-semibold">28</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-xs text-muted-foreground">Efficiency</div>
                    <div className="text-lg font-semibold">94%</div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Plan Utilization</span>
                    <span className="text-sm font-medium">{Math.round(usagePercentage)}%</span>
                  </div>
                  <Progress value={usagePercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>Next reset: {creditData.nextResetDate}</span>
                    <span>{creditData.totalCredits.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Daily Usage Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Daily Usage (Last 7 Days)</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={dailyUsageData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="date" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="credits" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={2}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Weekly Usage Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Weekly Usage Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={weeklyUsageData}>
                      <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                      <XAxis dataKey="week" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="credits" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Usage Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5" />
                  Usage Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-success/10 border border-success/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <ArrowUp className="size-4 text-success" />
                      <span className="font-medium text-success">Peak Efficiency</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Your highest usage day generated 3x more artifacts than average.
                    </p>
                  </div>
                  <div className="bg-warning/10 border border-warning/20 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="size-4 text-warning" />
                      <span className="font-medium text-warning">Usage Pattern</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Most credits used between 2-4 PM. Consider batching operations.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Breakdown Tab */}
          <TabsContent value="breakdown" className="space-y-6 mt-6">
            {/* Operation Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Credit Usage by Operation Type</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {operationBreakdown.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{item.operation}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {item.credits} credits
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.percentage}%
                        </Badge>
                      </div>
                    </div>
                    <Progress value={item.percentage} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recent Usage History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {creditData.usageHistory.slice(0, 10).map((usage, index) => (
                    <div key={usage.id} className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-lg">
                          <Activity className="size-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{usage.operation}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(usage.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-sm">-{usage.credits}</div>
                        <div className="text-xs text-muted-foreground">credits</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
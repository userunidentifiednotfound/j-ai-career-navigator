import { useProgress } from "@/hooks/useProgress";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, Zap, Target, CheckCircle2, Calendar, TrendingUp } from "lucide-react";

export default function ProgressPage() {
  const { progress, isLoading, totalTasks, completedTasks, completionRate, currentStreak, longestStreak } = useProgress();
  const { profile } = useProfile();

  const stats = [
    { title: "Tasks Completed", value: `${completedTasks}/${totalTasks}`, icon: CheckCircle2, color: "text-primary" },
    { title: "Completion Rate", value: `${completionRate}%`, icon: Target, color: "text-accent-foreground" },
    { title: "Current Streak", value: `${currentStreak} days`, icon: Zap, color: "text-warning" },
    { title: "Longest Streak", value: `${longestStreak} days`, icon: TrendingUp, color: "text-primary" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Progress</h1>
        <p className="text-sm text-muted-foreground">
          Track your growth as a {profile?.selected_role || "learner"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="font-display text-lg font-semibold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <BarChart3 className="h-5 w-5 text-primary" /> Skill Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading progress...</p>
          ) : progress && progress.length > 0 ? (
            progress.map((skill) => (
              <div key={skill.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-medium">{skill.skill_name}</span>
                  <span className="text-muted-foreground">{skill.completion_percentage}%</span>
                </div>
                <Progress value={skill.completion_percentage} className="h-2" />
                <p className="mt-1 text-xs text-muted-foreground">
                  {skill.days_practiced} days practiced • Streak: {skill.current_streak} days
                </p>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                <BarChart3 className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No skills tracked yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">Complete tasks to start building your skill profile.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

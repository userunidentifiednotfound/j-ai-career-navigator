import { useProfile } from "@/hooks/useProfile";
import { useTasks } from "@/hooks/useTasks";
import { useProgress } from "@/hooks/useProgress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BarChart3, ListTodo, FileText, Briefcase, Zap, Target, Sparkles, CheckCircle2, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

export default function Dashboard() {
  const { profile } = useProfile();
  const { tasks, generateTasks, toggleTask, completedCount, totalCount } = useTasks();
  const { completionRate, currentStreak } = useProgress();
  const navigate = useNavigate();

  const stats = [
    { title: "Today's Tasks", value: `${completedCount} / ${totalCount || "—"}`, icon: ListTodo, color: "text-primary" },
    { title: "Learning Streak", value: `${currentStreak} days`, icon: Zap, color: "text-warning" },
    { title: "Completion Rate", value: `${completionRate}%`, icon: Target, color: "text-accent-foreground" },
    { title: "Job Readiness", value: completionRate >= 70 ? "Ready" : completionRate >= 30 ? "Growing" : "Beginner", icon: Briefcase, color: "text-primary" },
  ];

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold md:text-3xl">
          Welcome back{profile?.full_name ? `, ${profile.full_name}` : ""}! 👋
        </h1>
        <p className="mt-1 text-muted-foreground">
          {profile?.selected_role ? `${profile.selected_role} track • ${profile.daily_time_minutes} min/day` : "Your career journey starts here."}
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

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Target className="h-5 w-5 text-primary" /> Today's Learning Plan
            </CardTitle>
            {totalCount === 0 && (
              <Button size="sm" className="gap-1" onClick={() => generateTasks.mutate()} disabled={generateTasks.isPending}>
                <Sparkles className="h-3.5 w-3.5" /> Generate
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {tasks && tasks.length > 0 ? (
              <div className="space-y-3">
                {tasks.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-start gap-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked) => toggleTask.mutate({ taskId: task.id, completed: !!checked })}
                      className="mt-0.5"
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                        {task.title}
                      </p>
                      {task.platform_name && (
                        <a href={task.platform_url || "#"} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                          <ExternalLink className="h-3 w-3" /> {task.platform_name}
                        </a>
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs shrink-0">{task.duration_minutes}m</Badge>
                  </div>
                ))}
                {totalCount > 4 && (
                  <Button variant="ghost" size="sm" onClick={() => navigate("/tasks")} className="w-full">
                    View all tasks →
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                  <ListTodo className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">Click Generate to create your tasks.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <BarChart3 className="h-5 w-5 text-primary" /> Skill Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {["Core Concepts", "Hands-on Practice", "Projects"].map((skill) => (
              <div key={skill}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{skill}</span>
                  <span className="text-muted-foreground">{completionRate > 0 ? `${Math.min(completionRate + Math.floor(Math.random() * 10), 100)}%` : "0%"}</span>
                </div>
                <Progress value={completionRate > 0 ? Math.min(completionRate + Math.floor(Math.random() * 10), 100) : 0} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

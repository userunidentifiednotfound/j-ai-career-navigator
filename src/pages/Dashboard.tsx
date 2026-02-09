import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BarChart3, ListTodo, FileText, Briefcase, Zap, Target } from "lucide-react";

export default function Dashboard() {
  const { profile } = useProfile();

  const stats = [
    { title: "Today's Tasks", value: "0 / 3", icon: ListTodo, color: "text-primary" },
    { title: "Learning Streak", value: "0 days", icon: Zap, color: "text-warning" },
    { title: "Resume Ready", value: "0%", icon: FileText, color: "text-success" },
    { title: "Job Readiness", value: "Beginner", icon: Briefcase, color: "text-accent" },
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Target className="h-5 w-5 text-primary" /> Today's Learning Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                <ListTodo className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Your AI-generated tasks will appear here.</p>
              <p className="mt-1 text-sm text-muted-foreground">Coming in the next update!</p>
            </div>
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
                  <span className="text-muted-foreground">0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

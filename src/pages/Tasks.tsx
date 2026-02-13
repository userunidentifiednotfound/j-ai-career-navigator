import { useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { useProfile } from "@/hooks/useProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, BookOpen, Code, RotateCcw, ExternalLink, ListTodo } from "lucide-react";

const typeConfig = {
  learn: { label: "Learn", icon: BookOpen, color: "bg-primary/10 text-primary" },
  practice: { label: "Practice", icon: Code, color: "bg-accent/10 text-accent-foreground" },
  revise: { label: "Revise", icon: RotateCcw, color: "bg-warning/10 text-warning" },
};

export default function Tasks() {
  const { tasks, isLoading, generateTasks, toggleTask, completedCount, totalCount } = useTasks();
  const { profile } = useProfile();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">My Tasks</h1>
          <p className="text-sm text-muted-foreground">
            {totalCount > 0
              ? `${completedCount} of ${totalCount} completed today`
              : "Generate your personalized learning tasks"}
          </p>
        </div>
        <Button
          onClick={() => generateTasks.mutate()}
          disabled={generateTasks.isPending || (totalCount > 0)}
          className="gap-2"
        >
          {generateTasks.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          {totalCount > 0 ? "Tasks Generated" : "Generate Tasks"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : tasks && tasks.length > 0 ? (
        <div className="space-y-3">
          {tasks.map((task) => {
            const config = typeConfig[task.task_type as keyof typeof typeConfig] || typeConfig.learn;
            const Icon = config.icon;
            return (
              <Card key={task.id} className={task.completed ? "opacity-60" : ""}>
                <CardContent className="flex items-start gap-4 p-4">
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) =>
                      toggleTask.mutate({ taskId: task.id, completed: !!checked })
                    }
                    className="mt-1"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`font-display font-semibold ${task.completed ? "line-through" : ""}`}>
                        {task.title}
                      </h3>
                      <Badge variant="secondary" className={`text-xs ${config.color}`}>
                        <Icon className="mr-1 h-3 w-3" />
                        {config.label}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {task.duration_minutes} min
                      </Badge>
                    </div>
                    {task.description && (
                      <p className="text-sm text-muted-foreground">{task.description}</p>
                    )}
                    {task.platform_name && (
                      <a
                        href={task.platform_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {task.platform_name}
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <ListTodo className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold">No tasks yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Click "Generate Tasks" to get AI-powered daily learning, practice, and revision tasks for{" "}
              {profile?.selected_role || "your role"}.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

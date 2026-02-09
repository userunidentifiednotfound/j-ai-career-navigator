import { Card, CardContent } from "@/components/ui/card";
import { BarChart3 } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-display text-2xl font-bold">Progress</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <BarChart3 className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold">Track your growth</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Skill completion, streaks, and weekly consistency will be tracked here as you complete tasks.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

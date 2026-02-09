import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export default function Jobs() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-display text-2xl font-bold">Jobs & Internships</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Briefcase className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold">Discover Opportunities</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            AI-powered job and internship discovery based on your role and skill readiness. Coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

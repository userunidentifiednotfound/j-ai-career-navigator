import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Resume() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-display text-2xl font-bold">Resume Builder</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <FileText className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold">ATS-Friendly Resume</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Build your resume with AI-powered suggestions, role-specific keywords, and export to PDF/DOCX. Coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

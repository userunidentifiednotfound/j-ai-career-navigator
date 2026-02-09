import { Card, CardContent } from "@/components/ui/card";
import { Bot } from "lucide-react";

export default function Mentor() {
  return (
    <div className="animate-fade-in space-y-6">
      <h1 className="font-display text-2xl font-bold">AI Mentor</h1>
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
            <Bot className="h-7 w-7 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg font-semibold">Your Career Assistant</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Chat with your AI mentor for career advice, skill recommendations, and resume tips. Coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

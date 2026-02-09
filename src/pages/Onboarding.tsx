import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { itRoles, nonItRoles, timeOptions, RoleCategory } from "@/data/roles";
import { toast } from "sonner";
import { Monitor, Briefcase, ArrowLeft, ArrowRight, Clock, Check, Zap } from "lucide-react";

type Step = "category" | "role" | "time";

export default function Onboarding() {
  const [step, setStep] = useState<Step>("category");
  const [category, setCategory] = useState<"IT" | "Non-IT" | null>(null);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const { updateProfile } = useProfile();
  const navigate = useNavigate();

  const roleCategories: RoleCategory[] = category === "IT" ? itRoles : nonItRoles;

  const handleFinish = async () => {
    if (!category || !selectedRole || !selectedTime) return;
    try {
      await updateProfile.mutateAsync({
        role_category: category,
        selected_role: selectedRole,
        daily_time_minutes: selectedTime,
        onboarding_completed: true,
      });
      toast.success("You're all set! Let's begin your journey.");
      navigate("/");
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">Set Up Your Path</h1>
          <div className="mt-4 flex justify-center gap-2">
            {(["category", "role", "time"] as Step[]).map((s, i) => (
              <div key={s} className={`h-1.5 w-16 rounded-full transition-colors ${
                (step === "category" && i === 0) || (step === "role" && i <= 1) || (step === "time" && i <= 2)
                  ? "bg-primary" : "bg-muted"
              }`} />
            ))}
          </div>
        </div>

        {step === "category" && (
          <div className="grid gap-4 sm:grid-cols-2">
            {([
              { key: "IT" as const, icon: Monitor, title: "IT Roles", desc: "Software, Data, Cloud, Security & more" },
              { key: "Non-IT" as const, icon: Briefcase, title: "Non-IT Roles", desc: "Marketing, HR, Finance, Sales & more" },
            ]).map(({ key, icon: Icon, title, desc }) => (
              <Card
                key={key}
                className={`cursor-pointer transition-all hover:shadow-md ${category === key ? "ring-2 ring-primary" : ""}`}
                onClick={() => { setCategory(key); setSelectedRole(null); }}
              >
                <CardContent className="flex flex-col items-center gap-3 p-8">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${category === key ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{title}</h3>
                  <p className="text-center text-sm text-muted-foreground">{desc}</p>
                </CardContent>
              </Card>
            ))}
            <div className="col-span-full mt-4 flex justify-end">
              <Button onClick={() => { if (category) setStep("role"); else toast.error("Please select a category"); }} className="gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "role" && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setStep("category")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-display text-lg font-semibold">Choose your role</h2>
            </div>
            <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-2">
              {roleCategories.map((cat) => (
                <div key={cat.name}>
                  <h3 className="mb-2 text-sm font-medium text-muted-foreground">{cat.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {cat.roles.map((role) => (
                      <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`rounded-lg border px-3 py-2 text-sm transition-all ${
                          selectedRole === role
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-card hover:border-primary/50"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button onClick={() => { if (selectedRole) setStep("time"); else toast.error("Please select a role"); }} className="gap-2">
                Next <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "time" && (
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setStep("role")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-display text-lg font-semibold">Daily time commitment</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {timeOptions.map((opt) => (
                <Card
                  key={opt.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${selectedTime === opt.value ? "ring-2 ring-primary" : ""}`}
                  onClick={() => setSelectedTime(opt.value)}
                >
                  <CardContent className="flex items-center gap-4 p-5">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${selectedTime === opt.value ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-display font-semibold">{opt.label}</p>
                      <p className="text-sm text-muted-foreground">{opt.description}</p>
                    </div>
                    {selectedTime === opt.value && <Check className="ml-auto h-5 w-5 text-primary" />}
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleFinish}
                disabled={!selectedTime || updateProfile.isPending}
                className="gap-2"
              >
                {updateProfile.isPending ? "Saving..." : "Start Learning"} <Zap className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

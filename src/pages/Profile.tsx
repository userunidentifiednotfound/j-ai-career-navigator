import { useState, useEffect } from "react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { itRoles, nonItRoles, timeOptions } from "@/data/roles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/hooks/use-toast";
import { User, Clock, Briefcase, Save, Loader2 } from "lucide-react";

export default function Profile() {
  const { profile, isLoading, updateProfile } = useProfile();
  const { user } = useAuth();

  const [fullName, setFullName] = useState("");
  const [roleCategory, setRoleCategory] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [dailyTime, setDailyTime] = useState("60");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || "");
      setRoleCategory(profile.role_category || "");
      setSelectedRole(profile.selected_role || "");
      setDailyTime(String(profile.daily_time_minutes || 60));
    }
  }, [profile]);

  const allCategories = [
    ...itRoles.map((c) => ({ ...c, type: "IT" })),
    ...nonItRoles.map((c) => ({ ...c, type: "Non-IT" })),
  ];

  const currentCategoryRoles =
    allCategories.find((c) => c.name === roleCategory)?.roles || [];

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({
        full_name: fullName,
        role_category: roleCategory,
        selected_role: selectedRole,
        daily_time_minutes: parseInt(dailyTime),
      });
      toast({ title: "Profile updated", description: "Your settings have been saved." });
    } catch {
      toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Profile Settings</h1>
        <p className="text-sm text-muted-foreground">
          Update your learning preferences and personal information
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <User className="h-5 w-5 text-primary" /> Personal Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Full Name</Label>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ""} disabled className="opacity-60" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Briefcase className="h-5 w-5 text-primary" /> Career Track
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Role Category</Label>
              <Select
                value={roleCategory}
                onValueChange={(v) => {
                  setRoleCategory(v);
                  setSelectedRole("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((cat) => (
                    <SelectItem key={cat.name} value={cat.name}>
                      {cat.type} — {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Target Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {currentCategoryRoles.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-display text-lg">
              <Clock className="h-5 w-5 text-primary" /> Daily Learning Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={dailyTime}
              onValueChange={setDailyTime}
              className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
            >
              {timeOptions.map((opt) => (
                <Label
                  key={opt.value}
                  htmlFor={`time-${opt.value}`}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition-colors ${
                    dailyTime === String(opt.value)
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <RadioGroupItem value={String(opt.value)} id={`time-${opt.value}`} />
                  <div>
                    <p className="font-medium">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.description}</p>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>
      </div>

      <Button
        onClick={handleSave}
        disabled={updateProfile.isPending}
        className="gap-2"
      >
        {updateProfile.isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Save className="h-4 w-4" />
        )}
        Save Changes
      </Button>
    </div>
  );
}

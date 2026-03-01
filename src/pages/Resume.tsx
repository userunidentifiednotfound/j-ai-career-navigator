import { useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import {
  FileText, Sparkles, Loader2, Plus, Trash2, Download, Lightbulb, CheckCircle2,
} from "lucide-react";
import { DEMO_RESUME, SKIP_AUTH_FOR_TESTING } from "@/lib/testingMode";

interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

interface ResumeData {
  summary: string;
  experienceBullets: { company: string; role: string; duration: string; bullets: string[] }[];
  skillCategories: { category: string; skills: string[] }[];
  keywords: string[];
  tips: string[];
}

export default function Resume() {
  const { profile } = useProfile();

  const [name, setName] = useState(SKIP_AUTH_FOR_TESTING ? DEMO_RESUME.personalInfo.name : (profile?.full_name || ""));
  const [email, setEmail] = useState(SKIP_AUTH_FOR_TESTING ? DEMO_RESUME.personalInfo.email : "");
  const [phone, setPhone] = useState(SKIP_AUTH_FOR_TESTING ? DEMO_RESUME.personalInfo.phone : "");
  const [location, setLocation] = useState(SKIP_AUTH_FOR_TESTING ? DEMO_RESUME.personalInfo.location : "");
  const [skills, setSkills] = useState(SKIP_AUTH_FOR_TESTING ? DEMO_RESUME.skills : "");
  const [education, setEducation] = useState(SKIP_AUTH_FOR_TESTING ? DEMO_RESUME.education : "");
  const [experiences, setExperiences] = useState<Experience[]>(
    SKIP_AUTH_FOR_TESTING ? (DEMO_RESUME.experience as Experience[]) : [{ company: "", role: "", duration: "", description: "" }]
  );
  const [resumeData, setResumeData] = useState<ResumeData | null>(
    SKIP_AUTH_FOR_TESTING ? (DEMO_RESUME.resumeData as ResumeData) : null
  );
  const [loading, setLoading] = useState(false);

  const addExperience = () =>
    setExperiences([...experiences, { company: "", role: "", duration: "", description: "" }]);

  const removeExperience = (i: number) =>
    setExperiences(experiences.filter((_, idx) => idx !== i));

  const updateExperience = (i: number, field: keyof Experience, value: string) =>
    setExperiences(experiences.map((exp, idx) => (idx === i ? { ...exp, [field]: value } : exp)));

  const generateResume = async () => {
    setLoading(true);
    try {
      if (SKIP_AUTH_FOR_TESTING) {
        setResumeData(DEMO_RESUME.resumeData as ResumeData);
        toast({ title: "Demo resume loaded", description: "Using sample resume data for screenshots." });
        return;
      }

      const { data, error } = await supabase.functions.invoke("generate-resume", {
        body: {
          personalInfo: { name, email, phone, location },
          experience: experiences.filter((e) => e.company || e.role),
          education,
          skills,
          targetRole: profile?.selected_role || "",
        },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setResumeData(data.resume);
      toast({ title: "Resume generated!", description: "Review your ATS-optimized resume below." });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to generate resume.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadAsText = () => {
    if (!resumeData) return;
    let text = `${name}\n${email} | ${phone} | ${location}\n\n`;
    text += `PROFESSIONAL SUMMARY\n${resumeData.summary}\n\n`;
    text += `EXPERIENCE\n`;
    resumeData.experienceBullets.forEach((exp) => {
      text += `${exp.role} at ${exp.company} (${exp.duration})\n`;
      exp.bullets.forEach((b) => (text += `  • ${b}\n`));
      text += "\n";
    });
    text += `SKILLS\n`;
    resumeData.skillCategories.forEach((cat) => {
      text += `${cat.category}: ${cat.skills.join(", ")}\n`;
    });
    text += `\nEDUCATION\n${education}\n`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_")}_Resume.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Resume Builder</h1>
        <p className="text-sm text-muted-foreground">
          Create an ATS-optimized resume with AI-powered suggestions
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input Form */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label>Full Name</Label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" />
                </div>
                <div className="space-y-1">
                  <Label>Phone</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 890" />
                </div>
                <div className="space-y-1">
                  <Label>Location</Label>
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City, Country" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="font-display text-lg">Experience</CardTitle>
              <Button variant="outline" size="sm" onClick={addExperience} className="gap-1">
                <Plus className="h-3.5 w-3.5" /> Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {experiences.map((exp, i) => (
                <div key={i} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Experience {i + 1}</span>
                    {experiences.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeExperience(i)} className="h-7 w-7">
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <Input value={exp.company} onChange={(e) => updateExperience(i, "company", e.target.value)} placeholder="Company" />
                    <Input value={exp.role} onChange={(e) => updateExperience(i, "role", e.target.value)} placeholder="Job Title" />
                  </div>
                  <Input value={exp.duration} onChange={(e) => updateExperience(i, "duration", e.target.value)} placeholder="Jan 2023 - Present" />
                  <Textarea value={exp.description} onChange={(e) => updateExperience(i, "description", e.target.value)} placeholder="Brief description of responsibilities..." rows={2} />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-display text-lg">Education & Skills</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label>Education</Label>
                <Textarea value={education} onChange={(e) => setEducation(e.target.value)} placeholder="B.Tech in Computer Science, XYZ University (2020-2024)" rows={2} />
              </div>
              <div className="space-y-1">
                <Label>Skills (comma-separated)</Label>
                <Textarea value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, Node.js, Python, AWS..." rows={2} />
              </div>
            </CardContent>
          </Card>

          <Button onClick={generateResume} disabled={loading} className="w-full gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating..." : "Generate ATS Resume"}
          </Button>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          {resumeData ? (
            <>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <FileText className="h-5 w-5 text-primary" /> Resume Preview
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={downloadAsText} className="gap-1">
                    <Download className="h-3.5 w-3.5" /> Download .txt
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h2 className="font-display text-xl font-bold">{name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {[email, phone, location].filter(Boolean).join(" • ")}
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-1 font-display font-semibold text-primary">Professional Summary</h3>
                    <p className="text-sm">{resumeData.summary}</p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 font-display font-semibold text-primary">Experience</h3>
                    {resumeData.experienceBullets.map((exp, i) => (
                      <div key={i} className="mb-3">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">{exp.role}</p>
                          <span className="text-xs text-muted-foreground">{exp.duration}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{exp.company}</p>
                        <ul className="mt-1 space-y-0.5">
                          {exp.bullets.map((b, j) => (
                            <li key={j} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div>
                    <h3 className="mb-2 font-display font-semibold text-primary">Skills</h3>
                    {resumeData.skillCategories.map((cat, i) => (
                      <div key={i} className="mb-2">
                        <p className="text-sm font-medium">{cat.category}</p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {cat.skills.map((s) => (
                            <Badge key={s} variant="secondary" className="text-xs">
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <Lightbulb className="h-5 w-5 text-warning" /> ATS Keywords & Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="mb-1 text-sm font-medium">Keywords Detected</p>
                    <div className="flex flex-wrap gap-1">
                      {resumeData.keywords.map((kw) => (
                        <Badge key={kw} variant="outline" className="text-xs">
                          {kw}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-sm font-medium">Improvement Tips</p>
                    <ul className="space-y-1">
                      {resumeData.tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-warning" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
                  <FileText className="h-7 w-7 text-muted-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold">ATS-Friendly Resume</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Fill in your details and click "Generate ATS Resume" to get an AI-optimized resume
                  tailored for {profile?.selected_role || "your target role"}.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

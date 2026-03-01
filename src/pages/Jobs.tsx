import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Search, Loader2, MapPin, Clock, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { DEMO_JOBS, SKIP_AUTH_FOR_TESTING } from "@/lib/testingMode";

interface Job {
  title: string;
  company: string;
  location: string;
  type: string;
  experience: string;
  skills: string[];
  platform: string;
  url: string;
  description: string;
}

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>(SKIP_AUTH_FOR_TESTING ? (DEMO_JOBS as Job[]) : []);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(SKIP_AUTH_FOR_TESTING);

  const searchJobs = async (searchQuery?: string) => {
    setLoading(true);
    setSearched(true);

    if (SKIP_AUTH_FOR_TESTING) {
      const q = (searchQuery || query).trim().toLowerCase();
      const filtered = q
        ? DEMO_JOBS.filter((job) =>
            [job.title, job.company, job.location, job.description, ...job.skills]
              .join(" ")
              .toLowerCase()
              .includes(q)
          )
        : DEMO_JOBS;
      setJobs(filtered as Job[]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("search-jobs", {
        body: { query: searchQuery || query || undefined },
      });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      setJobs(data.jobs || []);
    } catch (err: any) {
      toast({ title: "Error", description: err.message || "Failed to search jobs.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const typeColors: Record<string, string> = {
    "Full-time": "bg-primary/10 text-primary",
    "Part-time": "bg-accent/10 text-accent-foreground",
    Internship: "bg-warning/10 text-warning",
    Contract: "bg-secondary text-secondary-foreground",
    Remote: "bg-success/10 text-success",
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Jobs & Internships</h1>
        <p className="text-sm text-muted-foreground">
          AI-powered job discovery based on your role and skills
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          searchJobs();
        }}
        className="flex gap-2"
      >
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search jobs (or leave empty for role-based suggestions)..."
          className="flex-1"
        />
        <Button type="submit" disabled={loading} className="gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search
        </Button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {jobs.map((job, i) => (
            <Card key={i} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5 space-y-3">
                <div>
                  <h3 className="font-display font-semibold">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.company}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className={typeColors[job.type] || ""}>
                    {job.type}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-xs">
                    <MapPin className="h-3 w-3" /> {job.location}
                  </Badge>
                  <Badge variant="outline" className="gap-1 text-xs">
                    <Clock className="h-3 w-3" /> {job.experience}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
                <div className="flex flex-wrap gap-1">
                  {job.skills.slice(0, 4).map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  View on {job.platform}
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : searched ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Briefcase className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold">No results found</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Try adjusting your search query or leave it empty for role-based suggestions.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted">
              <Briefcase className="h-7 w-7 text-muted-foreground" />
            </div>
            <h3 className="font-display text-lg font-semibold">Discover Opportunities</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Click Search to find AI-curated jobs and internships matching your role and skills.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

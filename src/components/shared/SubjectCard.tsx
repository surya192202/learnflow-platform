import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { API_BASE } from "@/lib/api";
import type { Subject } from "@/lib/mock-data";

interface SubjectCardProps {
  subject: Subject;
}

const levelColor: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};

const SubjectCard = ({ subject }: SubjectCardProps) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem("token");

  // Fetch true progress if authenticated
  const { data: progressList } = useQuery({
    queryKey: ["progress", subject.id],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/progress/subjects/${subject.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: isAuthenticated && !!token,
  });

  const completedCount = progressList?.length || 0;
  const progressPercentage = subject.lessons > 0 
    ? Math.min(100, Math.round((completedCount / subject.lessons) * 100)) 
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
      className="group relative flex flex-col h-full bg-card rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-shadow duration-300"
    >
      <div className="relative aspect-video rounded-xl overflow-hidden mb-4 shrink-0">
        <img
          src={subject.thumbnail}
          alt={subject.title}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            const target = e.currentTarget;
            if (target.dataset.fallback === "true") return;
            target.dataset.fallback = "true";
            target.src = "/placeholder.svg";
          }}
        />
        <div className="absolute top-2 left-2 flex gap-2">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${levelColor[subject.level] || "bg-secondary text-muted-foreground"}`}>
            {subject.level}
          </span>
        </div>
        <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase text-foreground">
          {subject.duration}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-foreground leading-tight mb-2 group-hover:text-primary transition-colors">
        {subject.title}
      </h3>
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{subject.description}</p>

      {isAuthenticated && completedCount > 0 && (
        <div className="mb-4 space-y-1.5 shrink-0">
          <div className="flex justify-between items-center text-xs font-semibold text-foreground">
            <span>{progressPercentage}% completed</span>
            <span>{completedCount} / {subject.lessons} lessons</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-[hsl(var(--primary))] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-auto flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
          <span className="flex items-center gap-1">
            <BookOpen className="w-3.5 h-3.5" />
            {subject.lessons} lessons
          </span>
          <span>{subject.instructor}</span>
        </div>
        
        <Link
          to={`/subject/${subject.id}`}
          className="block w-full py-2.5 bg-foreground text-background text-sm font-medium rounded-xl text-center hover:opacity-90 transition-opacity mt-2"
        >
          {completedCount > 0 ? "Continue Learning" : "Enroll Now"}
        </Link>
      </div>
    </motion.div>
  );
};

export default SubjectCard;

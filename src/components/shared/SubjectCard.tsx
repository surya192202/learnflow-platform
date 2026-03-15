import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Clock, BookOpen } from "lucide-react";
import type { Subject } from "@/lib/mock-data";

interface SubjectCardProps {
  subject: Subject;
}

const levelColor: Record<string, string> = {
  Beginner: "bg-emerald-100 text-emerald-700",
  Intermediate: "bg-amber-100 text-amber-700",
  Advanced: "bg-rose-100 text-rose-700",
};

const SubjectCard = ({ subject }: SubjectCardProps) => (
  <motion.div
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
    className="group relative flex flex-col bg-card rounded-2xl p-4 shadow-card hover:shadow-card-hover transition-shadow duration-300"
  >
    <div className="relative aspect-video rounded-xl overflow-hidden mb-4">
      <img
        src={subject.thumbnail}
        alt={subject.title}
        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
      />
      <div className="absolute top-2 left-2">
        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${levelColor[subject.level] || "bg-secondary text-muted-foreground"}`}>
          {subject.level}
        </span>
      </div>
      <div className="absolute bottom-2 right-2 bg-background/90 backdrop-blur px-2 py-1 rounded-md text-[10px] font-bold tracking-wider uppercase text-foreground">
        {subject.duration}
      </div>
    </div>

    <h3 className="text-lg font-semibold text-foreground leading-tight mb-1 group-hover:text-primary transition-colors">
      {subject.title}
    </h3>
    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{subject.description}</p>

    <div className="mt-auto pt-4 flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          {subject.lessons} lessons
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {subject.duration}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{subject.instructor}</span>
        <span className="text-[10px] uppercase tracking-wider bg-secondary px-2 py-0.5 rounded-md">{subject.category}</span>
      </div>
      <Link
        to={`/subject/${subject.id}`}
        className="block w-full py-2.5 bg-foreground text-background text-sm font-medium rounded-xl text-center hover:opacity-90 transition-opacity"
      >
        {subject.progress > 0 ? "Continue Learning" : "Enroll Now"}
      </Link>
    </div>
  </motion.div>
);

export default SubjectCard;

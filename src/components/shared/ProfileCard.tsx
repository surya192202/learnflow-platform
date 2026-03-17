import type { Subject } from "@/lib/mock-data";
import ProgressBar from "./ProgressBar";
import { Link } from "react-router-dom";

interface ProfileCardProps {
  subject: Subject;
}

const ProfileCard = ({ subject }: ProfileCardProps) => (
  <div className="flex gap-4 p-4 bg-card rounded-2xl shadow-card hover:shadow-card-hover transition-shadow duration-300">
    <img
      src={subject.thumbnail}
      alt={subject.title}
      className="w-24 h-16 sm:w-32 sm:h-20 object-cover rounded-xl shrink-0"
      loading="lazy"
      onError={(e) => {
        const target = e.currentTarget;
        if (target.dataset.fallback === "true") return;
        target.dataset.fallback = "true";
        target.src = "/placeholder.svg";
      }}
    />
    <div className="flex-1 min-w-0">
      <h4 className="text-sm font-semibold text-foreground truncate">{subject.title}</h4>
      <p className="text-xs text-muted-foreground mt-0.5">{subject.instructor}</p>
      <div className="mt-2 flex items-center gap-3">
        <ProgressBar value={subject.progress} className="flex-1" />
        <span className="text-xs font-medium text-muted-foreground shrink-0">{subject.progress}%</span>
      </div>
      <Link
        to={`/course/${subject.id}`}
        className="inline-block mt-2 text-xs font-medium text-primary hover:underline"
      >
        Continue →
      </Link>
    </div>
  </div>
);

export default ProfileCard;

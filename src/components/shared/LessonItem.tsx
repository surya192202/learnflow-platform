import { Check, Lock, Play } from "lucide-react";
import type { Lesson } from "@/lib/mock-data";

interface LessonItemProps {
  lesson: Lesson;
  isActive: boolean;
  onClick: () => void;
}

const LessonItem = ({ lesson, isActive, onClick }: LessonItemProps) => {
  const getIcon = () => {
    if (lesson.completed) return <Check className="w-4 h-4 text-primary" />;
    if (lesson.locked) return <Lock className="w-3.5 h-3.5 text-muted-foreground" />;
    return <Play className="w-3.5 h-3.5 text-foreground" />;
  };

  return (
    <button
      onClick={onClick}
      disabled={lesson.locked}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
        isActive
          ? "bg-primary/10 text-primary"
          : lesson.locked
          ? "opacity-50 cursor-not-allowed"
          : "hover:bg-secondary text-foreground"
      }`}
    >
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
        lesson.completed ? "bg-primary/10" : isActive ? "bg-primary/10" : "bg-secondary"
      }`}>
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : ""}`}>
          {lesson.title}
        </p>
        <p className="text-xs text-muted-foreground">{lesson.duration}</p>
      </div>
    </button>
  );
};

export default LessonItem;

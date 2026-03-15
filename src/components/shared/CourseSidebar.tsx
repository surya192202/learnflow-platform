import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Section } from "@/lib/mock-data";
import LessonItem from "./LessonItem";

interface CourseSidebarProps {
  sections: Section[];
  currentLessonId: string;
  onSelectLesson: (sectionIdx: number, lessonIdx: number) => void;
  completedCount: number;
  totalCount: number;
}

const CourseSidebar = ({ sections, currentLessonId, onSelectLesson, completedCount, totalCount }: CourseSidebarProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    Object.fromEntries(sections.map((s) => [s.id, true]))
  );

  const toggleSection = (id: string) =>
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <aside className="w-full lg:w-80 h-auto lg:h-screen lg:sticky lg:top-0 border-b lg:border-b-0 lg:border-r border-border bg-secondary/30 overflow-y-auto">
      <div className="p-6 border-b border-border bg-card">
        <h2 className="font-semibold text-foreground">Course Curriculum</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {completedCount} / {totalCount} Lessons Completed
        </p>
      </div>
      <nav className="p-4 space-y-4">
        {sections.map((section, sIdx) => (
          <div key={section.id}>
            <button
              onClick={() => toggleSection(section.id)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-left"
            >
              <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                {section.title}
              </h4>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                  openSections[section.id] ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {openSections[section.id] && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: [0.2, 0, 0, 1] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-1 mt-1">
                    {section.lessons.map((lesson, lIdx) => (
                      <LessonItem
                        key={lesson.id}
                        lesson={lesson}
                        isActive={lesson.id === currentLessonId}
                        onClick={() => onSelectLesson(sIdx, lIdx)}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default CourseSidebar;

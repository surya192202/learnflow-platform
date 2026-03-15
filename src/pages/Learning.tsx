import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import CourseSidebar from "@/components/shared/CourseSidebar";
import VideoPlayer from "@/components/shared/VideoPlayer";
import ProgressBar from "@/components/shared/ProgressBar";
import { SUBJECTS } from "@/lib/mock-data";

const Learning = () => {
  const { id } = useParams();
  const subject = SUBJECTS.find((s) => s.id === id);

  const [currentSection, setCurrentSection] = useState(0);
  const [currentLesson, setCurrentLesson] = useState(0);

  if (!subject) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">Course not found.</p>
        </div>
      </div>
    );
  }

  const lesson = subject.sections[currentSection]?.lessons[currentLesson];
  const allLessons = subject.sections.flatMap((s) => s.lessons);
  const completedCount = allLessons.filter((l) => l.completed).length;
  const totalCount = allLessons.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const flatIndex = subject.sections
    .slice(0, currentSection)
    .reduce((acc, s) => acc + s.lessons.length, 0) + currentLesson;

  const goToLesson = (sIdx: number, lIdx: number) => {
    const l = subject.sections[sIdx]?.lessons[lIdx];
    if (l && !l.locked) {
      setCurrentSection(sIdx);
      setCurrentLesson(lIdx);
    }
  };

  const goPrev = () => {
    if (currentLesson > 0) {
      goToLesson(currentSection, currentLesson - 1);
    } else if (currentSection > 0) {
      const prevSection = currentSection - 1;
      goToLesson(prevSection, subject.sections[prevSection].lessons.length - 1);
    }
  };

  const goNext = () => {
    const sectionLessons = subject.sections[currentSection].lessons;
    if (currentLesson < sectionLessons.length - 1) {
      goToLesson(currentSection, currentLesson + 1);
    } else if (currentSection < subject.sections.length - 1) {
      goToLesson(currentSection + 1, 0);
    }
  };

  const hasPrev = flatIndex > 0;
  const hasNext = flatIndex < totalCount - 1;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 sm:px-8 sticky top-0 bg-background/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
          <Link to="/" className="hover:text-foreground transition-colors shrink-0">Subjects</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link to={`/subject/${subject.id}`} className="hover:text-foreground transition-colors truncate">
            {subject.title}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 hidden sm:block" />
          <span className="text-foreground font-medium truncate hidden sm:block">{lesson?.title}</span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <CourseSidebar
          sections={subject.sections}
          currentLessonId={lesson?.id || ""}
          onSelectLesson={goToLesson}
          completedCount={completedCount}
          totalCount={totalCount}
        />

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          <div className="max-w-5xl mx-auto w-full p-4 sm:p-8 space-y-8 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={lesson?.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                className="space-y-8"
              >
                {/* Video */}
                {lesson && <VideoPlayer src={lesson.videoUrl} title={lesson.title} />}

                {/* Progress bar below player */}
                <ProgressBar value={progressPercent} />

                {/* Lesson info */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="max-w-2xl">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      {currentSection + 1}.{currentLesson + 1} — {lesson?.title}
                    </h1>
                    <p className="mt-4 text-muted-foreground leading-relaxed text-pretty">
                      {lesson?.description}
                    </p>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all shrink-0 ${
                      lesson?.completed
                        ? "bg-primary/10 text-primary"
                        : "bg-primary text-primary-foreground shadow-lg"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    {lesson?.completed ? "Completed" : "Mark as Complete"}
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <div className="border-t border-border bg-card px-4 sm:px-8 py-4 flex items-center justify-between">
            <button
              onClick={goPrev}
              disabled={!hasPrev}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-secondary text-foreground hover:bg-secondary/80 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-xs text-muted-foreground hidden sm:block">
              Lesson {flatIndex + 1} of {totalCount}
            </span>
            <button
              onClick={goNext}
              disabled={!hasNext}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Learning;

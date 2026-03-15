import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, BookOpen, ChevronRight, Play, Lock } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ProgressBar from "@/components/shared/ProgressBar";
import { SUBJECTS } from "@/lib/mock-data";

const SubjectDetail = () => {
  const { id } = useParams();
  const subject = SUBJECTS.find((s) => s.id === id);

  if (!subject) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">Subject not found.</p>
        </div>
      </div>
    );
  }

  const totalLessons = subject.sections.reduce((acc, s) => acc + s.lessons.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <div className="relative bg-foreground overflow-hidden">
        <img
          src={subject.thumbnail}
          alt={subject.title}
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-2 text-sm text-background/60 mb-4">
              <Link to="/" className="hover:text-background/80 transition-colors">Subjects</Link>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="text-background/80">{subject.category}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-background mb-4">
              {subject.title}
            </h1>
            <p className="text-background/70 leading-relaxed mb-6">{subject.longDescription}</p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-background/60 mb-8">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-background/10 rounded-full flex items-center justify-center text-xs font-semibold text-background">
                  {subject.instructorAvatar}
                </div>
                <span>{subject.instructor}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>{totalLessons} lessons</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{subject.duration}</span>
              </div>
            </div>

            {subject.progress > 0 && (
              <div className="mb-6">
                <div className="flex justify-between text-xs text-background/50 mb-2">
                  <span>Progress</span>
                  <span>{subject.progress}%</span>
                </div>
                <ProgressBar value={subject.progress} />
              </div>
            )}

            <Link
              to={`/course/${subject.id}`}
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              {subject.progress > 0 ? "Continue Learning" : "Enroll Now"}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-8">Course Curriculum</h2>
        <div className="space-y-4">
          {subject.sections.map((section, sIdx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: sIdx * 0.1, duration: 0.4, ease: [0.2, 0, 0, 1] }}
              className="bg-card rounded-2xl shadow-card overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">
                  Section {sIdx + 1}: {section.title}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {section.lessons.length} lessons
                </p>
              </div>
              <div className="divide-y divide-border">
                {section.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-3 px-6 py-3"
                  >
                    <div className="w-7 h-7 rounded-lg bg-secondary flex items-center justify-center shrink-0">
                      {lesson.locked ? (
                        <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {lesson.title}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground shrink-0">{lesson.duration}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;

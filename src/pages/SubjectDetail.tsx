import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, BookOpen, ChevronRight, Play, Lock, Loader2, Check, BarChart3 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ProgressBar from "@/components/shared/ProgressBar";
import { fetchSubjectTree } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { SUBJECTS } from "@/lib/mock-data";

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function formatTotalDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

const SubjectDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [tree, setTree] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const mockSubject = SUBJECTS.find((s) => s.id === id);

  useEffect(() => {
    if (isAuthenticated && id) {
      setLoading(true);
      fetchSubjectTree(id)
        .then(setTree)
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated, id]);

  if (!mockSubject) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <p className="text-muted-foreground">Subject not found.</p>
        </div>
      </div>
    );
  }

  const allVideos = tree
    ? tree.sections.flatMap((s: any) => s.videos)
    : mockSubject.sections.flatMap((s) => s.lessons);
  const totalLessons = allVideos.length;
  const completedCount = tree
    ? allVideos.filter((v: any) => v.progress?.is_completed).length
    : 0;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  const totalDurationSec = tree
    ? allVideos.reduce((acc: number, v: any) => acc + (v.duration_seconds || 0), 0)
    : 0;

  const levelColor: Record<string, string> = {
    Beginner: "bg-emerald-100 text-emerald-700",
    Intermediate: "bg-amber-100 text-amber-700",
    Advanced: "bg-rose-100 text-rose-700",
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/courses" className="hover:text-foreground transition-colors">Courses</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-foreground">{mockSubject.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left Column - Course Info */}
          <div className="flex-1 min-w-0">
            {/* Thumbnail */}
            <div className="aspect-video rounded-2xl overflow-hidden mb-8 shadow-elevated">
              <img
                src={mockSubject.thumbnail}
                alt={mockSubject.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.dataset.fallback === "true") return;
                  target.dataset.fallback = "true";
                  target.src = "/placeholder.svg";
                }}
              />
            </div>

            {/* Title & Meta */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${levelColor[mockSubject.level] || "bg-secondary text-muted-foreground"}`}>
                  {mockSubject.level}
                </span>
                <span className="text-xs text-muted-foreground bg-secondary px-3 py-1 rounded-lg">
                  {mockSubject.category}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-4">
                {mockSubject.title}
              </h1>
              <p className="text-muted-foreground leading-relaxed mb-6">{mockSubject.longDescription}</p>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-xs font-semibold text-primary">
                    {mockSubject.instructorAvatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{mockSubject.instructor}</p>
                    <p className="text-xs text-muted-foreground">Instructor</p>
                  </div>
                </div>
              </div>

              {progressPercent > 0 && (
                <div className="mb-8 p-5 bg-card rounded-2xl shadow-card">
                  <div className="flex justify-between text-sm text-muted-foreground mb-3">
                    <span>Your Progress</span>
                    <span className="font-medium text-foreground">{progressPercent}%</span>
                  </div>
                  <ProgressBar value={progressPercent} />
                </div>
              )}
            </motion.div>

            {/* Curriculum */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold tracking-tight text-foreground mb-6">
                Course Curriculum
              </h2>

              {loading && (
                <div className="text-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                </div>
              )}

              <div className="space-y-4">
                {(tree ? tree.sections : mockSubject.sections).map((section: any, sIdx: number) => {
                  const videos = tree ? section.videos : section.lessons;
                  const sectionComplete = tree ? videos.filter((v: any) => v.progress?.is_completed).length : 0;
                  return (
                    <div
                      key={section.id}
                      className="bg-card rounded-2xl shadow-card overflow-hidden"
                    >
                      <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                        <div>
                          <h3 className="text-sm font-semibold text-foreground">
                            Section {sIdx + 1}: {section.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {videos.length} lessons
                            {tree && <> · {sectionComplete} completed</>}
                          </p>
                        </div>
                      </div>
                      <div className="divide-y divide-border">
                        {videos.map((lesson: any) => {
                          const isCompleted = tree ? lesson.progress?.is_completed : false;
                          const isLocked = tree ? lesson.locked : lesson.locked;
                          return (
                            <div
                              key={lesson.id}
                              className="flex items-center gap-3 px-6 py-3"
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                                isCompleted ? "bg-emerald-100" : "bg-secondary"
                              }`}>
                                {isCompleted ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : isLocked ? (
                                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                                ) : (
                                  <Play className="w-3.5 h-3.5 text-foreground" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-medium truncate ${isCompleted ? "text-muted-foreground" : "text-foreground"}`}>
                                  {lesson.title}
                                </p>
                              </div>
                              <span className="text-xs text-muted-foreground shrink-0">
                                {tree ? formatDuration(lesson.duration_seconds) : lesson.duration}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Enrollment Panel */}
          <div className="lg:w-80 shrink-0">
            <div className="lg:sticky lg:top-24">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="bg-card rounded-2xl shadow-card p-6 space-y-6"
              >
                {/* Enroll Button */}
                <Link
                  to={`/course/${mockSubject.id}`}
                  className="block w-full py-3.5 bg-primary text-primary-foreground text-base font-semibold rounded-xl text-center hover:opacity-90 transition-opacity shadow-lg"
                >
                  {progressPercent > 0 ? "Continue Learning" : "Enroll for Free"}
                </Link>

                {/* Course Info */}
                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Duration
                    </span>
                    <span className="font-medium text-foreground">
                      {tree ? formatTotalDuration(totalDurationSec) : mockSubject.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Lessons
                    </span>
                    <span className="font-medium text-foreground">{totalLessons}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Level
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${levelColor[mockSubject.level] || "bg-secondary text-muted-foreground"}`}>
                      {mockSubject.level}
                    </span>
                  </div>
                </div>

                {/* Instructor */}
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Instructor</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold text-primary">
                      {mockSubject.instructorAvatar}
                    </div>
                    <span className="text-sm font-medium text-foreground">{mockSubject.instructor}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="pt-4 border-t border-border space-y-3">
                  {["Full lifetime access", "Certificate of completion", "Sequential learning path"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      {f}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectDetail;

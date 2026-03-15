import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Loader2 } from "lucide-react";
import CourseSidebar from "@/components/shared/CourseSidebar";
import VideoPlayer from "@/components/shared/VideoPlayer";
import ProgressBar from "@/components/shared/ProgressBar";
import { fetchSubjectTree, markVideoComplete } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

interface VideoItem {
  id: number;
  title: string;
  description: string;
  youtube_url: string;
  duration_seconds: number;
  order_index: number;
  section_id: number;
  locked: boolean;
  previous_video_id: number | null;
  next_video_id: number | null;
  progress: {
    last_position_seconds: number;
    is_completed: boolean;
    completed_at: string | null;
  };
}

interface SectionItem {
  id: number;
  title: string;
  order_index: number;
  videos: VideoItem[];
}

interface SubjectTree {
  id: number;
  title: string;
  slug: string;
  description: string;
  sections: SectionItem[];
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const Learning = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const [tree, setTree] = useState<SubjectTree | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);
  const [marking, setMarking] = useState(false);

  const loadTree = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await fetchSubjectTree(id);
      setTree(data);

      // If no active video yet, select first unlocked
      if (!activeVideoId) {
        const allVids = data.sections.flatMap((s: SectionItem) => s.videos);
        const firstUnlocked = allVids.find((v: VideoItem) => !v.locked);
        if (firstUnlocked) setActiveVideoId(firstUnlocked.id);
      }
    } catch (e: any) {
      setError(e.message || "Failed to load course");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isAuthenticated) loadTree();
  }, [isAuthenticated, loadTree]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !tree) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">{error || "Course not found."}</p>
          <Link to="/" className="text-primary underline text-sm">Back to courses</Link>
        </div>
      </div>
    );
  }

  const allVideos = tree.sections.flatMap((s) => s.videos);
  const currentVideo = allVideos.find((v) => v.id === activeVideoId) || allVideos[0];
  const completedCount = allVideos.filter((v) => v.progress.is_completed).length;
  const totalCount = allVideos.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const currentFlatIndex = allVideos.findIndex((v) => v.id === currentVideo?.id);
  const hasPrev = currentFlatIndex > 0;
  const hasNext = currentFlatIndex < totalCount - 1;

  const goToVideo = (videoId: number) => {
    const vid = allVideos.find((v) => v.id === videoId);
    if (vid && !vid.locked) {
      setActiveVideoId(videoId);
    }
  };

  const goPrev = () => {
    if (hasPrev) goToVideo(allVideos[currentFlatIndex - 1].id);
  };

  const goNext = () => {
    if (hasNext) {
      const nextVid = allVideos[currentFlatIndex + 1];
      if (!nextVid.locked) goToVideo(nextVid.id);
    }
  };

  const handleMarkComplete = async () => {
    if (!currentVideo || currentVideo.progress.is_completed || marking) return;
    try {
      setMarking(true);
      await markVideoComplete(currentVideo.id);
      // Reload tree to get updated lock status
      const data = await fetchSubjectTree(id!);
      setTree(data);

      // Auto-advance to next unlocked lesson
      const updatedVideos = data.sections.flatMap((s: SectionItem) => s.videos);
      const idx = updatedVideos.findIndex((v: VideoItem) => v.id === currentVideo.id);
      if (idx < updatedVideos.length - 1) {
        const nextVid = updatedVideos[idx + 1];
        if (!nextVid.locked) {
          setActiveVideoId(nextVid.id);
        }
      }
    } catch (e: any) {
      console.error("Mark complete error:", e.message);
    } finally {
      setMarking(false);
    }
  };

  // Build sidebar-friendly sections
  const sidebarSections = tree.sections.map((s) => ({
    id: String(s.id),
    title: s.title,
    lessons: s.videos.map((v) => ({
      id: String(v.id),
      title: v.title,
      duration: formatDuration(v.duration_seconds),
      completed: v.progress.is_completed,
      locked: v.locked,
      videoUrl: v.youtube_url,
      description: v.description || "",
    })),
  }));

  const isComplete = progressPercent === 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky header */}
      <header className="h-14 border-b border-border flex items-center justify-between px-4 sm:px-8 sticky top-0 bg-background/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-2 text-sm text-muted-foreground min-w-0">
          <Link to="/" className="hover:text-foreground transition-colors shrink-0">Courses</Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
          <Link to={`/subject/${tree.slug}`} className="hover:text-foreground transition-colors truncate">
            {tree.title}
          </Link>
          <ChevronRight className="w-3.5 h-3.5 shrink-0 hidden sm:block" />
          <span className="text-foreground font-medium truncate hidden sm:block">{currentVideo?.title}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{progressPercent}% complete</span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-3.5rem)]">
        {/* Sidebar */}
        <CourseSidebar
          sections={sidebarSections}
          currentLessonId={String(currentVideo?.id)}
          onSelectLesson={(sIdx, lIdx) => {
            const section = tree.sections[sIdx];
            if (section) {
              const video = section.videos[lIdx];
              if (video && !video.locked) goToVideo(video.id);
            }
          }}
          completedCount={completedCount}
          totalCount={totalCount}
        />

        {/* Main content */}
        <main className="flex-1 flex flex-col">
          <div className="max-w-5xl mx-auto w-full p-4 sm:p-8 space-y-8 flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentVideo?.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                className="space-y-8"
              >
                {/* Video */}
                {currentVideo && <VideoPlayer src={currentVideo.youtube_url} title={currentVideo.title} />}

                {/* Progress bar below player */}
                <ProgressBar value={progressPercent} />

                {/* Completion banner */}
                {isComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center"
                  >
                    <h2 className="text-xl font-bold text-emerald-800">🎉 Course Completed!</h2>
                    <p className="text-sm text-emerald-600 mt-1">You've finished all {totalCount} lessons. Great work!</p>
                  </motion.div>
                )}

                {/* Lesson info */}
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="max-w-2xl">
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                      {currentFlatIndex + 1}. {currentVideo?.title}
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Duration: {currentVideo ? formatDuration(currentVideo.duration_seconds) : ""}
                    </p>
                    {currentVideo?.description && (
                      <p className="mt-4 text-muted-foreground leading-relaxed text-pretty">
                        {currentVideo.description}
                      </p>
                    )}
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleMarkComplete}
                    disabled={currentVideo?.progress.is_completed || marking}
                    className={`inline-flex items-center gap-2 px-6 py-3 font-semibold rounded-xl transition-all shrink-0 ${
                      currentVideo?.progress.is_completed
                        ? "bg-emerald-100 text-emerald-700 cursor-default"
                        : marking
                        ? "bg-muted text-muted-foreground cursor-wait"
                        : "bg-primary text-primary-foreground shadow-lg hover:opacity-90"
                    }`}
                  >
                    {marking ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    {currentVideo?.progress.is_completed
                      ? "Completed"
                      : marking
                      ? "Saving..."
                      : "Mark as Complete"}
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
              Lesson {currentFlatIndex + 1} of {totalCount}
            </span>
            <button
              onClick={goNext}
              disabled={!hasNext || allVideos[currentFlatIndex + 1]?.locked}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {currentVideo?.progress.is_completed && hasNext ? "Go to Next Lesson" : "Next"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Learning;

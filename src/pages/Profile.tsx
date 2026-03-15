import { motion } from "framer-motion";
import { BookOpen, Clock, Trophy } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ProfileCard from "@/components/shared/ProfileCard";
import { SUBJECTS, CURRENT_USER } from "@/lib/mock-data";

const Profile = () => {
  const enrolled = SUBJECTS.filter((s) => CURRENT_USER.enrolledSubjects.includes(s.id));
  const totalProgress = enrolled.length
    ? Math.round(enrolled.reduce((acc, s) => acc + s.progress, 0) / enrolled.length)
    : 0;

  const stats = [
    { label: "Enrolled Courses", value: enrolled.length, icon: BookOpen },
    { label: "Avg. Progress", value: `${totalProgress}%`, icon: Trophy },
    { label: "Total Hours", value: "40h+", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0, 0, 1] }}
          className="flex items-center gap-5 mb-10"
        >
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-xl font-bold text-primary-foreground shrink-0">
            {CURRENT_USER.avatar}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{CURRENT_USER.name}</h1>
            <p className="text-sm text-muted-foreground">{CURRENT_USER.email}</p>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-card rounded-2xl shadow-card p-5 text-center"
            >
              <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Continue Learning */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-foreground mb-4">Continue Learning</h2>
          <div className="space-y-3">
            {enrolled.filter((s) => s.progress > 0).map((subject) => (
              <ProfileCard key={subject.id} subject={subject} />
            ))}
          </div>
        </section>

        {/* Recent Activity */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="bg-card rounded-2xl shadow-card divide-y divide-border">
            {CURRENT_USER.recentLessons.map((item) => (
              <div key={item.lessonId} className="flex items-center justify-between px-5 py-4">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.subjectTitle}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 ml-4">{item.date}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;

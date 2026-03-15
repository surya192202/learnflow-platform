import { motion } from "framer-motion";
import { BookOpen, Clock, Trophy } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import ProfileCard from "@/components/shared/ProfileCard";
import { SUBJECTS } from "@/lib/mock-data";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  
  const userInitials = user?.name
    ? user.name.split(" ").map(n => n[0]).join("").toUpperCase()
    : "U";

  // For now, subjects are still from mock data (will be replaced when subjects API is connected)
  const enrolled = SUBJECTS.slice(0, 3);
  const totalProgress = enrolled.length
    ? Math.round(enrolled.reduce((acc, s) => acc + s.progress, 0) / enrolled.length)
    : 0;

  const stats = [
    { label: "Enrolled Courses", value: enrolled.length, icon: BookOpen },
    { label: "Avg. Progress", value: `${totalProgress}%`, icon: Trophy },
    { label: "Total Hours", value: "0h", icon: Clock },
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
            {userInitials}
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">{user?.name || "User"}</h1>
            <p className="text-sm text-muted-foreground">{user?.email || ""}</p>
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

        {/* Info */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4">Account Info</h2>
          <div className="bg-card rounded-2xl shadow-card p-5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Name</span>
              <span className="text-foreground font-medium">{user?.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Email</span>
              <span className="text-foreground font-medium">{user?.email}</span>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;

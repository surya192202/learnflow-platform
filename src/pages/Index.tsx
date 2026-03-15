import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Trophy, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <section className="py-20 sm:py-32">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0, 0, 1] }}
            className="max-w-3xl"
          >
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter text-foreground leading-[1.05]">
              Learn to build with
              <br />
              <span className="text-primary">real-world courses.</span>
            </h1>
            <p className="mt-6 text-xl text-muted-foreground max-w-xl leading-relaxed">
              Structured YouTube courses from top educators. Full Stack, Data Science, AI, and more — all in one place.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background text-base font-semibold rounded-2xl hover:opacity-90 transition-opacity shadow-lg"
              >
                Browse Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-foreground text-base font-semibold rounded-2xl hover:bg-secondary/80 transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Stats */}
        <section className="pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: BookOpen, label: "Courses", value: "8+", desc: "Structured paths" },
              { icon: Zap, label: "Lessons", value: "45+", desc: "Video lectures" },
              { icon: Users, label: "Educators", value: "Top", desc: "YouTube creators" },
              { icon: Trophy, label: "Free", value: "100%", desc: "Always free" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-card text-center"
              >
                <stat.icon className="w-6 h-6 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Features */}
        <section className="pb-24">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Why LearnFlow?
            </h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Everything you need to go from beginner to professional, completely free.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Structured Learning",
                desc: "Courses are organized into sections with sequential lessons. No jumping around — follow the path.",
              },
              {
                title: "Track Your Progress",
                desc: "Mark lessons complete, track your percentage, and see exactly where you left off.",
              },
              {
                title: "YouTube Powered",
                desc: "Learn from the best educators on YouTube. High-quality content, zero cost.",
              },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="bg-card rounded-2xl p-8 shadow-card"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;

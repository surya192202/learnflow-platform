import { motion } from "framer-motion";
import { Code2, BookOpen, Terminal } from "lucide-react";
import Navbar from "@/components/layout/Navbar";

const Practice = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Code2 className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground mb-4">
            Practice Zone
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto mb-10">
            Sharpen your skills with hands-on coding exercises. Coming soon.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-6 mt-8">
          {[
            {
              icon: Terminal,
              title: "Code Challenges",
              desc: "Solve real-world coding problems across different difficulty levels.",
              status: "Coming Soon",
            },
            {
              icon: BookOpen,
              title: "Quizzes",
              desc: "Test your understanding of course material with interactive quizzes.",
              status: "Coming Soon",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="bg-card rounded-2xl shadow-card p-8"
            >
              <item.icon className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{item.desc}</p>
              <span className="inline-block px-3 py-1 bg-secondary text-xs font-medium text-muted-foreground rounded-lg">
                {item.status}
              </span>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Practice;

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SubjectCard from "@/components/shared/SubjectCard";
import { SUBJECTS, CATEGORIES } from "@/lib/mock-data";

const Index = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = useMemo(() => {
    return SUBJECTS.filter((s) => {
      const matchesCategory = activeCategory === "All" || s.category === activeCategory;
      const matchesSearch =
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.instructor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tighter text-foreground text-balance">
            Master the craft of<br />digital systems.
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl text-pretty">
            Curated courses from industry practitioners. 84% of students complete their enrolled courses within 30 days.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-foreground text-background"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filtered.map((subject, i) => (
            <motion.div
              key={subject.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05, ease: [0.2, 0, 0, 1] }}
            >
              <SubjectCard subject={subject} />
            </motion.div>
          ))}
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No subjects found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;

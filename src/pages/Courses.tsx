import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import SubjectCard from "@/components/shared/SubjectCard";
import { SUBJECTS, CATEGORIES } from "@/lib/mock-data";

const Courses = () => {
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
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tighter text-foreground">
            Course Catalog
          </h1>
          <p className="mt-2 text-muted-foreground">
            {SUBJECTS.length} courses available. Choose your learning path.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => setActiveCategory("All")}
            className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
              activeCategory === "All"
                ? "bg-foreground text-background shadow-sm"
                : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
            }`}
          >
            All Courses
          </button>
          
          <div className="relative">
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              className={`appearance-none px-5 py-2.5 pr-10 text-sm font-semibold rounded-xl outline-none transition-all duration-200 cursor-pointer border border-transparent focus:ring-2 focus:ring-primary/20 ${
                activeCategory !== "All"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              }`}
            >
              <option value="All" disabled className="hidden">Filter by Category</option>
              {CATEGORIES.filter(c => c !== "All").map((cat) => (
                <option key={cat} value={cat} className="bg-background text-foreground font-medium py-2">
                  {cat}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
              <svg className={`w-4 h-4 ${activeCategory !== "All" ? "text-primary-foreground" : "text-muted-foreground"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
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
            <p className="text-muted-foreground">No courses found matching your criteria.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Courses;

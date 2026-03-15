import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { FileText, Lock, Upload, CheckCircle2, Search, Clock, FileType, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { SUBJECTS } from "@/lib/mock-data";
import { fetchSubjectsList } from "@/lib/api";

// Map of custom assignment data per subject
const ASSIGNMENT_DATA: Record<string, { title: string; objective: string; format: string; description: string; duration: string }> = {
  "full-stack-development": {
    title: "E-Commerce Frontend Showcase",
    objective: "Build a responsive landing page for an online store using React and Tailwind CSS.",
    format: "GitHub Repository Link or .ZIP file containing source code",
    description: "In this assignment, you will apply your knowledge of HTML, CSS, JavaScript, and React to construct a fully responsive frontend interface for an e-commerce website. The layout must include a hero section, a featured products grid, and a responsive navigation bar.",
    duration: "Estimated: 4-6 Hours"
  },
  "data-science": {
    title: "Exploratory Data Analysis (EDA) Report",
    objective: "Analyze a provided CSV dataset using Pandas and Matplotlib.",
    format: "Jupyter Notebook (.ipynb) or PDF Report",
    description: "Use Pandas to clean a raw dataset containing housing prices. Handle missing values, filter outliers, and use Matplotlib or Seaborn to generate 3 distinct visualizations (e.g., histogram, scatter plot, correlation heatmap) explaining price trends.",
    duration: "Estimated: 3-5 Hours"
  },
  "machine-learning": {
    title: "Predictive Classification Model",
    objective: "Train a Random Forest classifier using Scikit-Learn to predict customer churn.",
    format: "Jupyter Notebook (.ipynb) or Python Script (.py)",
    description: "You will be provided with a telecommunications dataset. Your task is to perform feature engineering, split the data into training/testing sets, train a classification model, and output a confusion matrix along with the model's accuracy, precision, and recall.",
    duration: "Estimated: 5-8 Hours"
  },
  "python-programming": {
    title: "Command-Line Task Manager",
    objective: "Build a CLI application in Python to manage a To-Do list saved in a JSON file.",
    format: "Python Source File (.py)",
    description: "Create a Python script that accepts command-line arguments to 'add', 'view', 'complete', and 'delete' tasks. The tasks must persist between script executions by reading and writing to a local JSON file. Implement try/except blocks for file handling.",
    duration: "Estimated: 2-4 Hours"
  },
  "web-development": {
    title: "Portfolio Website",
    objective: "Create a personal portfolio website with semantic HTML and CSS Grid/Flexbox.",
    format: "Live URL (Netlify/Vercel) or .ZIP file",
    description: "Design a multi-page static portfolio. It must include an 'About Me', 'Projects' grid (using CSS Grid), and a functional 'Contact' form representation. The design must be perfectly responsive on mobile devices.",
    duration: "Estimated: 3-5 Hours"
  },
  "sql-databases": {
    title: "Database Normalization & Querying",
    objective: "Design a 3NF relational schema and write complex JOIN queries.",
    format: "SQL Script (.sql) and ER Diagram (.png/pdf)",
    description: "Given a flat denormalized spreadsheet of university enrollments, design a normalized schema (Students, Courses, Enrollments, Departments). Write the SQL CREATE TABLE statements and provide 3 queries: one using an INNER JOIN, one using a LEFT JOIN, and one using a GROUP BY with HAVING.",
    duration: "Estimated: 4-6 Hours"
  },
  "react-development": {
    title: "State Management Dashboard",
    objective: "Build an interactive dashboard using React Context or Redux.",
    format: "GitHub Repository Link",
    description: "Create a metrics dashboard that fetches mock data from a free public API. Provide global state filtering controls (e.g., date range, category) that update multiple isolated chart/table components simultaneously without prop drilling.",
    duration: "Estimated: 5-7 Hours"
  },
  "nodejs-backend": {
    title: "RESTful User API",
    objective: "Develop a secure CRUD API using Node.js, Express, and JWT.",
    format: "GitHub Repository Link",
    description: "Construct a Node.js API that allows users to register, login, and fetch a protected profile route. Passwords must be hashed with bcrypt. Output cleanly formatted JSON responses and use appropriate HTTP status codes.",
    duration: "Estimated: 4-6 Hours"
  }
};

const Assignment = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [activeSubjectId, setActiveSubjectId] = useState<string>(SUBJECTS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Enrollment query - fetch all subjects to see if user has progress for the selected subject
  const { data: progressData } = useQuery({
    queryKey: ['subject-progress-list', activeSubjectId],
    queryFn: async () => {
      if (!isAuthenticated) return null;
      const res = await fetch(`http://localhost:3000/api/progress/subjects/${activeSubjectId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}`, "Content-Type": "application/json" }
      });
      if (!res.ok) return null;
      return res.json();
    },
    enabled: isAuthenticated && !!activeSubjectId,
  });

  const subject = SUBJECTS.find(s => s.id === activeSubjectId) || SUBJECTS[0];
  const assignment = ASSIGNMENT_DATA[activeSubjectId];
  
  // Calculate completion percentage
  const totalLessons = subject.sections.flatMap(s => s.lessons).length;
  const completedLessons = progressData ? progressData.filter((p: any) => p.is_completed).length : 0;
  const progressPercent = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
  
  // User must be enrolled (progressData exists/array) AND completed 100% to upload
  const isEnrolled = !!progressData && Array.isArray(progressData);
  const isCompleted = isEnrolled && progressPercent === 100;

  const filteredSubjects = useMemo(() => {
    return SUBJECTS.filter(s => 
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (ASSIGNMENT_DATA[s.id]?.title || "").toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Handle unauthenticated state gracefully
  if (!authLoading && !isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 py-20 text-center">
          <Lock className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-foreground mb-4">Authentication Required</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8">
            You must be logged in to view and submit assignments.
          </p>
          <button 
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Log In Now
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar: Assignment List */}
        <div className="w-full lg:w-80 shrink-0 flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Assignments</h1>
            <p className="text-sm text-muted-foreground mt-1">Select a course to view tasks</p>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden flex flex-col max-h-[600px]">
            <div className="overflow-y-auto p-2 space-y-1">
              {filteredSubjects.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSubjectId(s.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                    activeSubjectId === s.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <p className="font-semibold text-sm truncate">{s.title}</p>
                  <p className={`text-xs mt-1 truncate ${activeSubjectId === s.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    {ASSIGNMENT_DATA[s.id]?.title || "Capstone Project"}
                  </p>
                </button>
              ))}
              {filteredSubjects.length === 0 && (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No assignments found.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content: Assignment Details */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSubjectId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-3xl border border-border/50 shadow-sm overflow-hidden min-h-[600px] flex flex-col"
            >
              {!assignment ? (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-6">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">No Assignment Available</h2>
                  <p className="text-muted-foreground max-w-sm">
                    This course currently does not have an active assignment. Please check back later.
                  </p>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="p-8 border-b border-border relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                    
                    <div className="flex items-start justify-between gap-4 relative z-10">
                      <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-semibold text-foreground mb-4">
                          <BookOpen className="w-3.5 h-3.5" />
                          {subject.title}
                        </div>
                        <h2 className="text-3xl font-bold text-foreground tracking-tight mb-2">
                          {assignment.title}
                        </h2>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {assignment.duration}
                          </div>
                          <div className="flex items-center gap-1">
                            <FileType className="w-4 h-4" />
                            {assignment.format}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-8 flex-1 flex flex-col">
                    
                    {/* Enrollment / Status Gate Banner */}
                    <div className="mb-8">
                      {!isEnrolled ? (
                        <div className="bg-secondary/50 border border-border rounded-2xl p-6 flex items-start gap-4">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">Enrollment Required</h3>
                            <p className="text-sm text-muted-foreground mt-1 mb-4">
                              You must enroll in this course to unlock its assignments. Visit the course page to start learning.
                            </p>
                            <Link to={`/course/${subject.id}`} className="inline-flex px-4 py-2 bg-foreground text-background text-sm font-semibold rounded-lg hover:opacity-90">
                              Go to Course
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-4 border-background bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-sm shrink-0">
                              {progressPercent}%
                            </div>
                            <div>
                              <h3 className="font-semibold text-foreground">Course Progress</h3>
                              <p className="text-sm text-muted-foreground">
                                {isCompleted 
                                  ? "Course completed! You may now submit your assignment." 
                                  : "Complete all video lessons to unlock the submission form."}
                              </p>
                            </div>
                          </div>
                          {isCompleted && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-semibold rounded-lg shrink-0">
                              <CheckCircle2 className="w-4 h-4" />
                              Unlocked
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Description & Objective */}
                    <div className="space-y-8 flex-1">
                      <section>
                        <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                          Objective
                        </h3>
                        <p className="text-muted-foreground leading-relaxed bg-secondary/30 p-4 rounded-xl border border-border/50">
                          {assignment.objective}
                        </p>
                      </section>

                      <section>
                        <h3 className="text-lg font-bold text-foreground mb-3">Task Details</h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {assignment.description}
                        </p>
                      </section>
                    </div>

                    {/* Upload / Submission Section */}
                    {isEnrolled && (
                      <div className="mt-10 pt-8 border-t border-border">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-foreground">Submit Assignment</h3>
                        </div>
                        
                        <div className={`border-2 border-dashed rounded-3xl p-10 text-center transition-colors ${
                          isCompleted ? "border-primary/30 bg-primary/5 hover:border-primary/50 hover:bg-primary/10 cursor-pointer" : "border-border bg-secondary/30 opacity-60 cursor-not-allowed"
                        }`}>
                          <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                            isCompleted ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground shadow-sm"
                          }`}>
                            {isCompleted ? <Upload className="w-8 h-8" /> : <Lock className="w-8 h-8" />}
                          </div>
                          <h4 className="font-bold text-foreground mb-2">
                            {isCompleted ? "Click to upload your solution" : "Submission Locked"}
                          </h4>
                          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                            {isCompleted 
                              ? `Allowed formats: ${assignment.format}` 
                              : "You must complete 100% of the course video lessons before you can submit the final assignment."}
                          </p>
                        </div>
                      </div>
                    )}

                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default Assignment;

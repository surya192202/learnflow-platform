import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, CheckCircle2, ChevronRight, BookOpen, HelpCircle, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { SUBJECTS } from "@/lib/mock-data";
import { Link } from "react-router-dom";

// Practice questions per course
const PRACTICE_QUESTIONS: Record<string, { question: string; options: string[]; answer: number }[]> = {
  "full-stack-development": [
    { question: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], answer: 0 },
    { question: "Which CSS property is used for flexible layouts?", options: ["float", "display: flex", "position: relative", "margin: auto"], answer: 1 },
    { question: "What is the correct way to declare a variable in modern JavaScript?", options: ["var x = 5", "let x = 5", "variable x = 5", "int x = 5"], answer: 1 },
    { question: "Which React hook is used for side effects?", options: ["useState", "useEffect", "useContext", "useRef"], answer: 1 },
    { question: "What does REST stand for in REST API?", options: ["Real-time Exchange State Transfer", "Representational State Transfer", "Remote Execution Server Transfer", "Request Exchange Standard Transfer"], answer: 1 },
  ],
  "data-science": [
    { question: "Which Python library is used for numerical computing?", options: ["Pandas", "NumPy", "Matplotlib", "Seaborn"], answer: 1 },
    { question: "What does a DataFrame in Pandas represent?", options: ["A graph", "A 2D labeled data structure", "A neural network", "A file format"], answer: 1 },
    { question: "Which chart type is best for showing distribution?", options: ["Line chart", "Pie chart", "Histogram", "Scatter plot"], answer: 2 },
    { question: "What is the purpose of the train-test split?", options: ["Speed up training", "Evaluate model performance", "Reduce dataset size", "Clean data"], answer: 1 },
    { question: "What does the mean of a dataset represent?", options: ["Most frequent value", "Middle value", "Average value", "Range of values"], answer: 2 },
  ],
  "machine-learning": [
    { question: "What type of ML uses labeled data?", options: ["Unsupervised", "Supervised", "Reinforcement", "Semi-supervised"], answer: 1 },
    { question: "Which algorithm is used for classification?", options: ["Linear Regression", "K-Means", "Logistic Regression", "PCA"], answer: 2 },
    { question: "What is overfitting?", options: ["Model is too simple", "Model memorizes training data", "Model has no bias", "Model runs too fast"], answer: 1 },
    { question: "What does a decision tree split on?", options: ["Random values", "Feature thresholds", "Output labels", "Dataset size"], answer: 1 },
    { question: "What is the activation function in neural networks?", options: ["Loss function", "Function that introduces non-linearity", "Optimizer", "Data normalizer"], answer: 1 },
  ],
  "python-programming": [
    { question: "What is the correct file extension for Python?", options: [".py", ".python", ".pt", ".pn"], answer: 0 },
    { question: "Which keyword defines a function in Python?", options: ["function", "func", "def", "define"], answer: 2 },
    { question: "What does 'self' refer to in a Python class?", options: ["The module", "The current instance", "The parent class", "A global variable"], answer: 1 },
    { question: "How do you handle errors in Python?", options: ["if/else", "try/except", "for/while", "switch/case"], answer: 1 },
    { question: "Which data type is immutable in Python?", options: ["List", "Dictionary", "Tuple", "Set"], answer: 2 },
  ],
  "sql-databases": [
    { question: "What does SQL stand for?", options: ["Structured Query Language", "Simple Query Logic", "Standard Query Layout", "System Query Language"], answer: 0 },
    { question: "Which SQL command retrieves data?", options: ["INSERT", "DELETE", "SELECT", "UPDATE"], answer: 2 },
    { question: "What is a primary key?", options: ["First column", "Unique identifier for a row", "Foreign reference", "Index name"], answer: 1 },
    { question: "Which JOIN returns all rows from both tables?", options: ["INNER JOIN", "LEFT JOIN", "FULL OUTER JOIN", "CROSS JOIN"], answer: 2 },
    { question: "What is normalization?", options: ["Adding indexes", "Reducing data redundancy", "Encrypting data", "Backing up data"], answer: 1 },
  ],
  "web-development": [
    { question: "What is the purpose of media queries?", options: ["Query databases", "Make responsive designs", "Fetch APIs", "Handle events"], answer: 1 },
    { question: "Which HTML tag is used for the largest heading?", options: ["<h6>", "<heading>", "<h1>", "<head>"], answer: 2 },
    { question: "What does the DOM stand for?", options: ["Document Object Model", "Data Object Manager", "Display Output Method", "Document Order Map"], answer: 0 },
    { question: "Which CSS unit is relative to the font size?", options: ["px", "em", "cm", "in"], answer: 1 },
    { question: "What is Next.js primarily used for?", options: ["Mobile apps", "Server-side React", "Database management", "Testing"], answer: 1 },
  ],
  "java-programming": [
    { question: "Which keyword creates a new object in Java?", options: ["create", "new", "init", "make"], answer: 1 },
    { question: "What is JVM?", options: ["Java Visual Machine", "Java Virtual Machine", "Java Version Manager", "Java Variable Method"], answer: 1 },
    { question: "Which access modifier makes a member visible to all classes?", options: ["private", "protected", "public", "default"], answer: 2 },
    { question: "What is polymorphism?", options: ["Multiple inheritance", "Objects taking different forms", "Encapsulating data", "Static typing"], answer: 1 },
    { question: "Which collection maintains insertion order?", options: ["HashSet", "HashMap", "ArrayList", "TreeSet"], answer: 2 },
  ],
  "artificial-intelligence": [
    { question: "What is a neural network inspired by?", options: ["Computer circuits", "Human brain", "Mathematical formulas", "Search engines"], answer: 1 },
    { question: "What does NLP stand for?", options: ["New Language Processing", "Natural Language Processing", "Neural Learning Protocol", "Normal Logic Parsing"], answer: 1 },
    { question: "Which framework is developed by Google for deep learning?", options: ["PyTorch", "Scikit-learn", "TensorFlow", "Keras only"], answer: 2 },
    { question: "What is a CNN primarily used for?", options: ["Text processing", "Image recognition", "Audio synthesis", "Tabular data"], answer: 1 },
    { question: "What does backpropagation do?", options: ["Forward pass data", "Adjusts weights based on error", "Normalizes input", "Selects features"], answer: 1 },
  ],
  "react-development": [
    { question: "What is JSX?", options: ["A syntax extension for JS", "A new programming language", "A backend framework", "A database query language"], answer: 0 },
    { question: "Which hook runs on component mount?", options: ["useState", "useEffect", "useRef", "useMemo"], answer: 1 },
    { question: "What is Redux used for?", options: ["Database management", "Animations", "State Management", "Routing"], answer: 2 },
    { question: "How do you pass data from parent to child?", options: ["Context", "State", "Hooks", "Props"], answer: 3 },
    { question: "What does Next.js add to React?", options: ["More UI components", "Server-side rendering", "Better CSS", "Nothing"], answer: 1 },
  ],
  "nodejs-backend": [
    { question: "What is Node.js built on?", options: ["SpiderMonkey", "V8 JavaScript engine", "Chakra", "Rhino"], answer: 1 },
    { question: "Which framework is most popular for Node.js APIs?", options: ["Laravel", "Django", "Express", "Flask"], answer: 2 },
    { question: "What is the Event Loop?", options: ["Handles asynchronous callbacks", "A 'for' loop", "Database polling", "UI refreshing"], answer: 0 },
    { question: "How do you create a web server natively?", options: ["net.server", "http.createServer", "express.create", "app.listen"], answer: 1 },
    { question: "What is JWT?", options: ["Java Web Tools", "JSON Web Token", "JavaScript Window Timer", "Joint Web Team"], answer: 1 },
  ],
  "cloud-computing": [
    { question: "What does AWS stand for?", options: ["Amazon Web Services", "Advanced Web Solutions", "Automated Web Services", "Ample Web Storage"], answer: 0 },
    { question: "Which AWS service is used for scalable computing?", options: ["S3", "RDS", "EC2", "IAM"], answer: 2 },
    { question: "What is S3 used for?", options: ["Running databases", "Object storage", "Machine Learning", "Sending emails"], answer: 1 },
    { question: "What is Serverless compute in AWS?", options: ["AWS EC2", "AWS S3", "AWS Lambda", "AWS VPC"], answer: 2 },
    { question: "What is a VPC?", options: ["Virtual Private Cloud", "Video Processing Center", "Virtual Public Cloud", "Visual Private Computer"], answer: 0 },
  ],
  "devops-fundamentals": [
    { question: "What is Docker used for?", options: ["Database hosting", "Virtual Machines", "Containerization", "Load Balancing"], answer: 2 },
    { question: "What orchestrates containers?", options: ["Jenkins", "Kubernetes", "Git", "Ansible"], answer: 1 },
    { question: "What is Jenkins primarily used for?", options: ["Writing code", "Monitoring logs", "Continuous Integration", "Database backups"], answer: 2 },
    { question: "What does CI/CD stand for?", options: ["Constant Input / Constant Delivery", "Continuous Integration / Continuous Deployment", "Code Improvement / Code Development", "Central Integration / Central Deployment"], answer: 1 },
    { question: "What is a Dockerfile?", options: ["A log file", "A script to build a Docker image", "A container instance", "A network config"], answer: 1 },
  ],
  "cyber-security": [
    { question: "What is ethical hacking?", options: ["Stealing data legally", "Writing malware", "Authorized penetration testing", "Hacking for free"], answer: 2 },
    { question: "What is a DDoS attack?", options: ["Distributed Denial of Service", "Direct Denial of Security", "Data Dump over Server", "Distributed Data of Service"], answer: 0 },
    { question: "What does SSL/TLS provide?", options: ["Faster internet", "Encryption for network communication", "Ad blocking", "File compression"], answer: 1 },
    { question: "What is SQL Injection?", options: ["Inserting malicious SQL code into inputs", "Speeding up database queries", "A tool for DB admins", "Extracting data legally"], answer: 0 },
    { question: "What is phishing?", options: ["A type of firewall", "Fraudulent attempt to obtain sensitive information", "A network protocol", "An encryption standard"], answer: 1 },
  ],
};

const Practice = () => {
  const { isAuthenticated } = useAuth();
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Set<string>>(new Set());
  
  // Practice flow state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  // Fetch enrollment status from backend
  useEffect(() => {
    if (!isAuthenticated) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch("http://localhost:3000/api/subjects", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((subjects: any[]) => {
        const enrolled = new Set<string>();
        const promises = subjects.map(async (sub) => {
          try {
            const res = await fetch(`http://localhost:3000/api/progress/subjects/${sub.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            const progress = await res.json();
            if (Array.isArray(progress) && progress.length > 0) {
              const mockSub = SUBJECTS.find((s) => s.title === sub.title);
              if (mockSub) enrolled.add(mockSub.id);
            }
          } catch {}
        });
        Promise.all(promises).then(() => setEnrolledCourses(enrolled));
      })
      .catch(() => {});
  }, [isAuthenticated]);

  const selectedSubject = SUBJECTS.find((s) => s.id === selectedCourseId);
  const isEnrolled = selectedCourseId ? enrolledCourses.has(selectedCourseId) : false;
  const questions = selectedCourseId ? (PRACTICE_QUESTIONS[selectedCourseId] || []) : [];

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  const handleOptionSelect = (optIdx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(optIdx);
  };

  const handleSubmit = () => {
    if (selectedOption === null) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const handleReset = () => { 
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setShowResults(false);
  };

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        {/* Left Sidebar — Course List */}
        <aside className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-border bg-card/50 backdrop-blur shrink-0">
          <div className="p-5 border-b border-border">
            <h2 className="text-sm font-semibold text-foreground">Practice Zone</h2>
            <p className="text-xs text-muted-foreground mt-1">Select an enrolled course to practice</p>
          </div>
          <nav className="p-3 space-y-1 max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
            {SUBJECTS.map((subject) => {
              const enrolled = enrolledCourses.has(subject.id);
              const isActive = selectedCourseId === subject.id;
              return (
                <button
                  key={subject.id}
                  onClick={() => handleCourseSelect(subject.id)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                    isActive
                      ? "bg-accent text-primary shadow-sm"
                      : "hover:bg-secondary text-foreground"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    enrolled ? "bg-emerald-100" : "bg-secondary"
                  }`}>
                    {enrolled ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{subject.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-0.5">
                      {enrolled ? "Enrolled" : "Locked"}
                    </p>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right Panel */}
        <main className="flex-1 p-6 sm:p-10 flex items-center justify-center">
          {!selectedCourseId ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center text-center"
            >
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                <HelpCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Select a Course</h2>
              <p className="text-muted-foreground max-w-md">
                Choose a course from the left sidebar to access practice questions. You must be enrolled in a course to practice.
              </p>
            </motion.div>
          ) : !isEnrolled ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center text-center max-w-md bg-card p-10 rounded-3xl shadow-card"
            >
              <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mb-6">
                <Lock className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Practice Locked</h2>
              <p className="text-muted-foreground mb-8">
                Enroll in <span className="font-medium text-foreground">{selectedSubject?.title}</span> to unlock practice questions.
              </p>
              <Link
                to={`/subject/${selectedCourseId}`}
                className="w-full inline-flex justify-center items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-sm"
              >
                <BookOpen className="w-4 h-4" />
                Enroll in this Course
              </Link>
            </motion.div>
          ) : showResults ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full max-w-lg bg-card p-10 rounded-3xl shadow-card text-center"
            >
              <h2 className="text-3xl font-bold text-foreground mb-2">Practice Complete!</h2>
              <p className="text-muted-foreground mb-8">You completed the {selectedSubject?.title} practice session.</p>
              
              <div className="flex flex-col items-center justify-center mb-8">
                <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold mb-4 shadow-inner" style={{
                    background: `conic-gradient(hsl(var(--primary)) ${(score / questions.length) * 100}%, hsl(var(--secondary)) 0)`
                }}>
                  <div className="w-28 h-28 bg-card rounded-full flex items-center justify-center">
                    <span className="text-primary">{score}/{questions.length}</span>
                  </div>
                </div>
                <p className="text-lg font-medium">
                  {score === questions.length ? "Perfect Score! Mastered." : score >= questions.length / 2 ? "Great job! Keep practicing." : "Needs more review. Try again!"}
                </p>
              </div>

              <button
                onClick={handleReset}
                className="w-full px-8 py-3.5 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-opacity shadow-sm"
              >
                Practice Again
              </button>
            </motion.div>
          ) : (
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-full max-w-2xl bg-card rounded-3xl shadow-card overflow-hidden"
            >
              {/* Header and Progress */}
              <div className="bg-secondary/50 p-6 border-b border-border">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-muted-foreground uppercase tracking-wider text-xs">
                    {selectedSubject?.title}
                  </h3>
                  <span className="text-xs font-bold bg-background px-3 py-1 rounded-full shadow-sm text-foreground">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </span>
                </div>
                <div className="h-1.5 bg-background rounded-full overflow-hidden w-full">
                  <div 
                    className="h-full bg-primary transition-all duration-300 rounded-full"
                    style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
                  />
                </div>
              </div>

              <div className="p-8 sm:p-10">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-8 leading-snug">
                  {currentQ.question}
                </h2>

                <div className="grid gap-3 mb-10">
                  {currentQ.options.map((opt, oIdx) => {
                    const isSelected = selectedOption === oIdx;
                    const isCorrect = isAnswerSubmitted && oIdx === currentQ.answer;
                    const isWrong = isAnswerSubmitted && isSelected && oIdx !== currentQ.answer;
                    
                    let bgClass = "bg-background border-border hover:border-primary/40";
                    let textClass = "text-foreground";

                    if (isAnswerSubmitted) {
                      if (isCorrect) {
                        bgClass = "bg-emerald-50 border-emerald-400";
                        textClass = "text-emerald-800 font-medium";
                      } else if (isWrong) {
                        bgClass = "bg-rose-50 border-rose-400";
                        textClass = "text-rose-800 font-medium";
                      } else if (isSelected) {
                        bgClass = "bg-secondary border-border opacity-50";
                      } else {
                        bgClass = "bg-background border-border opacity-50";
                      }
                    } else if (isSelected) {
                      bgClass = "bg-accent border-primary/50 ring-1 ring-primary/20";
                      textClass = "text-primary font-medium";
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleOptionSelect(oIdx)}
                        disabled={isAnswerSubmitted}
                        className={`w-full text-left px-5 py-4 rounded-xl text-sm transition-all border shadow-sm ${bgClass} ${textClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                            isCorrect ? "bg-emerald-100 border-emerald-500 text-emerald-600" :
                            isWrong ? "bg-rose-100 border-rose-500 text-rose-600" :
                            isSelected ? "bg-primary border-primary text-primary-foreground" : "bg-transparent border-input text-muted-foreground"
                          }`}>
                            {isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> :
                             isWrong ? <span className="text-xs font-bold leading-none">×</span> :
                             <span className="text-[10px] font-bold">{String.fromCharCode(65 + oIdx)}</span>}
                          </div>
                          {opt}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex justify-end border-t border-border pt-6">
                  {!isAnswerSubmitted ? (
                    <button
                      onClick={handleSubmit}
                      disabled={selectedOption === null}
                      className="px-8 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Submit Answer
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-foreground text-background font-semibold rounded-xl hover:opacity-90 transition-all shadow-sm"
                    >
                      {currentQuestionIndex < questions.length - 1 ? "Next Question" : "See Results"}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Practice;

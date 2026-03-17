import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, Users, Trophy, Zap, Code, Database, Brain, Cloud, Shield, Layout, Server, Activity, Bot, Send, User } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const [chatMessages, setChatMessages] = useState<{role: 'ai'|'user', text: string}[]>([
    { role: 'ai', text: 'Hi! I am your AI learning assistant. How can I help you today?' }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:3000/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
        },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await response.json();

      if (response.ok) {
        setChatMessages(prev => [...prev, { role: 'ai', text: data.response }]);
      } else {
        const errorMsg = data.error?.message || "I'm having trouble connecting right now.";
        setChatMessages(prev => [...prev, { role: 'ai', text: `⚠️ ${errorMsg}` }]);
      }
    } catch (error) {
      setChatMessages(prev => [...prev, { role: 'ai', text: "⚠️ Unable to reach the AI assistant. Please check your connection." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="py-16 sm:py-24 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
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
              Expert-led structured courses in Full Stack, Data Science, AI, and more — all in one place, completely free.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-2xl hover:opacity-90 transition-opacity shadow-lg"
              >
                Browse Courses
                <ArrowRight className="w-5 h-5" />
              </Link>
              {isAuthenticated ? (
                <Link
                  to="/profile"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-foreground text-base font-semibold rounded-2xl hover:bg-secondary/80 transition-colors"
                >
                  Continue Learning
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-secondary text-foreground text-base font-semibold rounded-2xl hover:bg-secondary/80 transition-colors"
                >
                  Get Started Free
                </Link>
              )}
            </div>
          </motion.div>

          {/* AI Chat Box */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.2, 0, 0, 1] }}
            className="w-full lg:w-[400px] shrink-0 bg-card rounded-3xl shadow-elevated border border-border/50 flex flex-col h-[500px] overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-border bg-secondary/30 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground text-sm">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">Ask AI for learning help</p>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <AnimatePresence initial={false}>
                {chatMessages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'ai' ? 'bg-primary/10 text-primary' : 'bg-secondary text-foreground'}`}>
                      {msg.role === 'ai' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                        : 'bg-secondary text-foreground rounded-tl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Bot className="w-4 h-4 animate-pulse" />
                    </div>
                    <div className="bg-secondary text-foreground px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm">
                      <span className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                        <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"></span>
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-3 bg-secondary/30 border-t border-border mt-auto">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Type your question..."
                  className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className="absolute right-2 w-8 h-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        </section>

        {/* Featured Learning Categories */}
        <section className="pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Featured Categories</h2>
                <p className="mt-2 text-muted-foreground">Explore our most popular learning paths.</p>
              </div>
              <Link to="/courses" className="hidden sm:flex text-sm font-semibold text-primary hover:text-primary/80 transition-colors items-center gap-1">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { name: "Full Stack Dev", icon: Layout, color: "text-blue-500", bg: "bg-blue-50" },
                { name: "Data Science", icon: Database, color: "text-emerald-500", bg: "bg-emerald-50" },
                { name: "Machine Learning", icon: Brain, color: "text-purple-500", bg: "bg-purple-50" },
                { name: "Cloud Computing", icon: Cloud, color: "text-sky-500", bg: "bg-sky-50" },
                { name: "Cyber Security", icon: Shield, color: "text-rose-500", bg: "bg-rose-50" },
                { name: "Backend APIs", icon: Server, color: "text-amber-500", bg: "bg-amber-50" },
                { name: "Python Core", icon: Code, color: "text-indigo-500", bg: "bg-indigo-50" },
                { name: "System Design", icon: Activity, color: "text-teal-500", bg: "bg-teal-50" },
              ].map((category, i) => (
                <Link to="/courses" key={category.name}>
                  <motion.div
                    whileHover={{ y: -4 }}
                    className="bg-card rounded-2xl p-6 shadow-card hover:shadow-card-hover border border-border/50 transition-all cursor-pointer h-full flex flex-col items-center text-center gap-3"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-1 ${category.bg} ${category.color}`}>
                      <category.icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-foreground text-sm">{category.name}</h3>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Platform Highlights & Benefits */}
        <section className="pb-32">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-bold tracking-tight text-foreground">
              Why Learn Here?
            </h2>
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-lg">
              We provide a complete ecosystem to take you from beginner to professional, completely free.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Structured Learning",
                desc: "Courses are organized logically. No jumping around — follow the guided chronological path to success.",
              },
              {
                icon: Zap,
                title: "Guided Progress",
                desc: "Track your completion percentage precisely. Previous lessons must be finished before moving forward.",
              },
              {
                icon: Trophy,
                title: "Practical Exercises",
                desc: "Hone your knowledge with dedicated practice tests that challenge you question-by-question.",
              },
              {
                icon: Users,
                title: "Flexible Course Paths",
                desc: "Whether you want to be a Full Stack dev or an AI engineer, choose a path that fits your goals.",
              },
            ].map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="bg-card rounded-3xl p-8 shadow-card border border-border/50 flex flex-col items-start"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <feat.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feat.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  locked: boolean;
  videoUrl: string;
  description: string;
}

export interface Section {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Subject {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar: string;
  description: string;
  longDescription: string;
  progress: number;
  lessons: number;
  duration: string;
  thumbnail: string;
  category: string;
  level: string;
  sections: Section[];
}

// ─── Full Stack Development ────────────────────────────────────
const fullStackSections: Section[] = [
  {
    id: "fs-s1",
    title: "HTML & CSS Foundations",
    lessons: [
      { id: "fs-l1",  title: "HTML Crash Course",           duration: "68:18", completed: false, locked: false, videoUrl: "https://www.youtube.com/embed/qz0aGYrrlhU", description: "Complete HTML tutorial for beginners — tags, forms, semantic markup, and page structure." },
      { id: "fs-l2",  title: "CSS Full Course",             duration: "85:03", completed: false, locked: true,  videoUrl: "https://www.youtube.com/embed/OXGznpKZ_sA", description: "CSS from scratch — selectors, box model, flexbox, grid, and responsive design." },
      { id: "fs-l3",  title: "Flexbox & Grid Layout",       duration: "45:30", completed: false, locked: true,  videoUrl: "https://www.youtube.com/embed/phWxA89Dy94", description: "Master modern CSS layouts with Flexbox and CSS Grid." },
    ],
  },
  {
    id: "fs-s2",
    title: "JavaScript Core",
    lessons: [
      { id: "fs-l4",  title: "JavaScript Full Course",      duration: "134:12", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/PkZNo7MFNFg", description: "Learn JavaScript — variables, functions, DOM manipulation, ES6+, and async programming." },
      { id: "fs-l5",  title: "ES6+ Modern JavaScript",      duration: "52:10",  completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/NCwa_xi0Uuc", description: "Arrow functions, destructuring, promises, async/await, and modules." },
    ],
  },
  {
    id: "fs-s3",
    title: "React & Frontend",
    lessons: [
      { id: "fs-l6",  title: "React JS Full Course",        duration: "143:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/bMknfKXIFA8", description: "Build modern UIs with React — JSX, components, hooks, state management, and routing." },
      { id: "fs-l7",  title: "React Hooks Deep Dive",       duration: "38:15",  completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/TNhaISOUy6Q", description: "useState, useEffect, useContext, useReducer, and custom hooks explained." },
    ],
  },
  {
    id: "fs-s4",
    title: "Backend with Node & Express",
    lessons: [
      { id: "fs-l8",  title: "Node.js Full Course",         duration: "100:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/Oe421EPjeBE", description: "Server-side JavaScript with Node.js — modules, file system, HTTP, and npm." },
      { id: "fs-l9",  title: "Express.js Crash Course",     duration: "35:18",  completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/SccSCuHhOw0", description: "Build REST APIs with Express — routes, middleware, error handling." },
      { id: "fs-l10", title: "MySQL & Database Design",     duration: "60:00",  completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY", description: "Relational databases, SQL queries, joins, and schema design with MySQL." },
    ],
  },
];

// ─── Data Science ──────────────────────────────────────────────
const dataScienceSections: Section[] = [
  {
    id: "ds-s1",
    title: "Python Essentials",
    lessons: [
      { id: "ds-l1", title: "Python for Beginners",         duration: "60:00",  completed: false, locked: false, videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8", description: "Learn Python programming from zero — variables, loops, functions, and data types." },
      { id: "ds-l2", title: "Python Data Structures",       duration: "45:00",  completed: false, locked: true,  videoUrl: "https://www.youtube.com/embed/8DvywoWv6fI", description: "Lists, dictionaries, tuples, sets, and comprehensions in Python." },
    ],
  },
  {
    id: "ds-s2",
    title: "Data Analysis Libraries",
    lessons: [
      { id: "ds-l3", title: "NumPy Full Tutorial",           duration: "58:10",  completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/QUT1VHiLmmI", description: "NumPy arrays, mathematical operations, broadcasting, and linear algebra basics." },
      { id: "ds-l4", title: "Pandas Complete Guide",         duration: "70:00",  completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/vmEHCJofslg", description: "DataFrames, data cleaning, groupby, merging, and time series with Pandas." },
      { id: "ds-l5", title: "Data Visualization with Matplotlib", duration: "33:51", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/3Xc3CA655Y4", description: "Line plots, bar charts, histograms, scatter plots, and customization." },
    ],
  },
  {
    id: "ds-s3",
    title: "Statistics & ML Intro",
    lessons: [
      { id: "ds-l6", title: "Statistics for Data Science",  duration: "66:00",  completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/xxpc-HPKN28", description: "Probability, distributions, hypothesis testing, and statistical inference." },
      { id: "ds-l7", title: "Machine Learning in 2 Hours",  duration: "120:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/7eh4d6sabA0", description: "Supervised and unsupervised learning, regression, classification, and model evaluation." },
    ],
  },
];

// ─── Machine Learning ──────────────────────────────────────────
const mlSections: Section[] = [
  {
    id: "ml-s1",
    title: "ML Foundations",
    lessons: [
      { id: "ml-l1", title: "Machine Learning Basics",       duration: "90:00",  completed: false, locked: false, videoUrl: "https://www.youtube.com/embed/ukzFI9rgwfU", description: "Core ML concepts — supervised vs unsupervised learning, bias-variance tradeoff." },
      { id: "ml-l2", title: "Linear & Logistic Regression",  duration: "48:20",  completed: false, locked: true,  videoUrl: "https://www.youtube.com/embed/VmbA0WUc-9I", description: "Learn regression models, cost functions, gradient descent, and classification." },
    ],
  },
  {
    id: "ml-s2",
    title: "Advanced Algorithms",
    lessons: [
      { id: "ml-l3", title: "Decision Trees & Random Forests", duration: "42:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/7VeUPuFGJHk", description: "Tree-based models, ensemble methods, and random forest implementation." },
      { id: "ml-l4", title: "Neural Networks Explained",      duration: "55:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/aircAruvnKk", description: "Neurons, layers, activation functions, backpropagation, and deep learning basics." },
      { id: "ml-l5", title: "Scikit-Learn Full Tutorial",     duration: "72:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/pqNCD_5r0IU", description: "Practical ML with scikit-learn — preprocessing, training, evaluation, and pipelines." },
    ],
  },
];

// ─── Python Programming ────────────────────────────────────────
const pythonSections: Section[] = [
  {
    id: "py-s1",
    title: "Getting Started",
    lessons: [
      { id: "py-l1", title: "Python Full Course for Beginners", duration: "240:00", completed: false, locked: false, videoUrl: "https://www.youtube.com/embed/XKHEtdqhLK8", description: "Complete Python programming course — setup, syntax, data types, control flow." },
      { id: "py-l2", title: "Python OOP Concepts",              duration: "53:00",  completed: false, locked: true,  videoUrl: "https://www.youtube.com/embed/JeznW_7DlB0", description: "Classes, objects, inheritance, polymorphism, encapsulation, and abstraction." },
    ],
  },
  {
    id: "py-s2",
    title: "Intermediate Python",
    lessons: [
      { id: "py-l3", title: "File Handling & Exceptions",       duration: "28:00",  completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/HYrXogLj7vg", description: "Read/write files, error handling, try/except blocks, and context managers." },
      { id: "py-l4", title: "Python Decorators & Generators",   duration: "35:00",  completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/FsAPt_9Bf3U", description: "Advanced functions, closures, decorators, generators, and itertools." },
      { id: "py-l5", title: "Python Projects for Practice",     duration: "180:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/8ext9G7xspg", description: "Hands-on projects: web scraper, automation scripts, API client, and CLI tools." },
    ],
  },
];

// ─── Web Development ───────────────────────────────────────────
const webDevSections: Section[] = [
  {
    id: "wd-s1",
    title: "Frontend Essentials",
    lessons: [
      { id: "wd-l1", title: "HTML & CSS for Beginners",    duration: "60:00", completed: false, locked: false, videoUrl: "https://www.youtube.com/embed/mU6anWqZJcc", description: "Build your first website — structuring content with HTML and styling with CSS." },
      { id: "wd-l2", title: "JavaScript DOM Manipulation",  duration: "40:00", completed: false, locked: true,  videoUrl: "https://www.youtube.com/embed/5fb2aPlgoys", description: "Select elements, handle events, and dynamically update web pages with JavaScript." },
      { id: "wd-l3", title: "Responsive Design",            duration: "28:00", completed: false, locked: true,  videoUrl: "https://www.youtube.com/embed/srvUrASNj0s", description: "Media queries, mobile-first design, and responsive frameworks." },
    ],
  },
  {
    id: "wd-s2",
    title: "Modern Frameworks",
    lessons: [
      { id: "wd-l4", title: "Tailwind CSS Crash Course",    duration: "38:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/UBOj6rqRUME", description: "Utility-first CSS framework — setup, classes, responsive design, and dark mode." },
      { id: "wd-l5", title: "Next.js Full Tutorial",        duration: "75:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/mTz0GXj8NN0", description: "Server-side rendering, file-based routing, and API routes with Next.js." },
    ],
  },
];

// ─── SQL & Databases ───────────────────────────────────────────
const sqlSections: Section[] = [
  {
    id: "sql-s1",
    title: "SQL Fundamentals",
    lessons: [
      { id: "sql-l1", title: "SQL Full Course",              duration: "255:00", completed: false, locked: false, videoUrl: "https://www.youtube.com/embed/HXV3zeQKqGY", description: "Everything about SQL — SELECT, INSERT, UPDATE, DELETE, joins, and subqueries." },
      { id: "sql-l2", title: "Database Design & Normalization", duration: "40:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/ztHopE5Wnpc", description: "Design scalable databases — ER diagrams, normalization forms, and relationships." },
    ],
  },
  {
    id: "sql-s2",
    title: "Advanced SQL",
    lessons: [
      { id: "sql-l3", title: "Advanced SQL Queries",         duration: "52:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/M-55BmjOuXY", description: "Window functions, CTEs, stored procedures, indexing, and query optimization." },
      { id: "sql-l4", title: "MongoDB Crash Course",         duration: "36:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/ofme2o29ngU", description: "NoSQL databases, documents, collections, CRUD, and aggregation with MongoDB." },
    ],
  },
];

// ─── Java Programming ──────────────────────────────────────────
const javaSections: Section[] = [
  {
    id: "java-s1",
    title: "Java Basics",
    lessons: [
      { id: "java-l1", title: "Java Full Course",             duration: "144:00", completed: false, locked: false, videoUrl: "https://www.youtube.com/embed/eIrMbAQSU34", description: "Complete Java programming — syntax, OOP, collections, and exception handling." },
      { id: "java-l2", title: "Java OOP Deep Dive",           duration: "96:00",  completed: false, locked: true,  videoUrl: "https://www.youtube.com/embed/6T_HgnjoYwM", description: "Interfaces, abstract classes, polymorphism, and SOLID principles in Java." },
    ],
  },
  {
    id: "java-s2",
    title: "Java Backend",
    lessons: [
      { id: "java-l3", title: "Spring Boot Tutorial",         duration: "80:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/9SGDpanrc8U", description: "Build REST APIs with Spring Boot — controllers, services, JPA, and security." },
      { id: "java-l4", title: "Java Data Structures",         duration: "48:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/RBSGKlAvoiM", description: "Arrays, linked lists, stacks, queues, trees, and graphs in Java." },
    ],
  },
];

// ─── AI & Deep Learning ────────────────────────────────────────
const aiSections: Section[] = [
  {
    id: "ai-s1",
    title: "AI Fundamentals",
    lessons: [
      { id: "ai-l1", title: "Artificial Intelligence Full Course", duration: "240:00", completed: false, locked: false, videoUrl: "https://www.youtube.com/embed/JMUxmLyrhSk", description: "AI fundamentals — search algorithms, knowledge representation, and intelligent agents." },
      { id: "ai-l2", title: "Deep Learning Crash Course",          duration: "60:00",  completed: false, locked: true,  videoUrl: "https://www.youtube.com/embed/VyWAvY2CF9c", description: "Neural network architectures, CNNs, RNNs, and training deep learning models." },
    ],
  },
  {
    id: "ai-s2",
    title: "Applied AI",
    lessons: [
      { id: "ai-l3", title: "TensorFlow 2.0 Tutorial",            duration: "75:00",  completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/tPYj3fFJGjk", description: "Build and train neural networks with TensorFlow and Keras." },
      { id: "ai-l4", title: "NLP with Transformers",               duration: "55:00",  completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/N_8pu37w9BY", description: "Natural Language Processing — tokenization, embeddings, BERT, and GPT architectures." },
      { id: "ai-l5", title: "Computer Vision with OpenCV",         duration: "66:00",  completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/oXlwWbU8l2o", description: "Image processing, object detection, and face recognition with OpenCV Python." },
    ],
  },
];

// ── Helper to count lessons and compute total duration ──
function computeMeta(sections: Section[]) {
  const allLessons = sections.flatMap((s) => s.lessons);
  const totalMinutes = allLessons.reduce((acc, l) => {
    const parts = l.duration.split(":");
    return acc + parseInt(parts[0]) + (parts[1] ? parseInt(parts[1]) / 60 : 0);
  }, 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  return { lessons: allLessons.length, duration: `${hours}h ${mins}m` };
}

const fsMeta = computeMeta(fullStackSections);
const dsMeta = computeMeta(dataScienceSections);
const mlMeta = computeMeta(mlSections);
const pyMeta = computeMeta(pythonSections);
const wdMeta = computeMeta(webDevSections);
const sqlMeta = computeMeta(sqlSections);
const javaMeta = computeMeta(javaSections);
const aiMeta = computeMeta(aiSections);

export const SUBJECTS: Subject[] = [
  {
    id: "full-stack-development",
    title: "Full Stack Web Development",
    instructor: "freeCodeCamp",
    instructorAvatar: "FC",
    description: "Master HTML, CSS, JavaScript, React, Node.js, Express, and MySQL to become a full stack developer.",
    longDescription: "This comprehensive program takes you from zero to full stack developer. You will learn to build modern, responsive frontends with HTML, CSS, and React, then power them with server-side APIs built on Node.js and Express. Finally, you'll connect everything to MySQL databases. By the end, you can build complete web applications from scratch.",
    progress: 0,
    lessons: fsMeta.lessons,
    duration: fsMeta.duration,
    thumbnail: "https://images.unsplash.com/photo-1627398242149-179d1e1e23b4?auto=format&fit=crop&q=80&w=800",
    category: "Full Stack Development",
    level: "Beginner",
    sections: fullStackSections,
  },
  {
    id: "data-science",
    title: "Data Science with Python",
    instructor: "freeCodeCamp",
    instructorAvatar: "FC",
    description: "Learn Python, NumPy, Pandas, Matplotlib, statistics, and machine learning fundamentals.",
    longDescription: "Dive into the world of data science. This course covers Python programming, data manipulation with NumPy and Pandas, data visualization with Matplotlib, and introduces statistics and machine learning. You'll gain the skills to analyze real-world datasets and extract meaningful insights.",
    progress: 0,
    lessons: dsMeta.lessons,
    duration: dsMeta.duration,
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Data Science",
    level: "Beginner",
    sections: dataScienceSections,
  },
  {
    id: "machine-learning",
    title: "Machine Learning A-Z",
    instructor: "Tech With Tim",
    instructorAvatar: "TT",
    description: "From regression to neural networks — learn practical machine learning with scikit-learn.",
    longDescription: "This course takes you through the most important machine learning algorithms. Starting with linear regression and progressing to neural networks and ensemble methods, you'll build real models using scikit-learn. Each concept is reinforced with hands-on code examples and practical projects.",
    progress: 0,
    lessons: mlMeta.lessons,
    duration: mlMeta.duration,
    thumbnail: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=800",
    category: "Machine Learning",
    level: "Intermediate",
    sections: mlSections,
  },
  {
    id: "python-programming",
    title: "Python Programming Masterclass",
    instructor: "Programming with Mosh",
    instructorAvatar: "PM",
    description: "Complete Python course covering basics, OOP, file handling, decorators, and real-world projects.",
    longDescription: "Whether you're a complete beginner or looking to deepen your Python skills, this masterclass has you covered. Start with fundamentals, move to object-oriented programming, then tackle advanced topics like decorators and generators. Finish with hands-on projects that solidify your knowledge.",
    progress: 0,
    lessons: pyMeta.lessons,
    duration: pyMeta.duration,
    thumbnail: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800",
    category: "Python Programming",
    level: "Beginner",
    sections: pythonSections,
  },
  {
    id: "web-development",
    title: "Modern Web Development",
    instructor: "Traversy Media",
    instructorAvatar: "TM",
    description: "Build responsive websites with HTML, CSS, JavaScript, Tailwind CSS, and Next.js.",
    longDescription: "Learn everything you need to build modern, professional websites. This course covers HTML and CSS fundamentals, JavaScript DOM manipulation, responsive design techniques, utility-first styling with Tailwind CSS, and server-side rendering with Next.js.",
    progress: 0,
    lessons: wdMeta.lessons,
    duration: wdMeta.duration,
    thumbnail: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800",
    category: "Web Development",
    level: "Beginner",
    sections: webDevSections,
  },
  {
    id: "sql-databases",
    title: "SQL & Database Engineering",
    instructor: "freeCodeCamp",
    instructorAvatar: "FC",
    description: "Master SQL queries, database design, normalization, and explore NoSQL with MongoDB.",
    longDescription: "Databases are the backbone of every application. This course teaches you relational database design, SQL querying from basic to advanced, normalization, indexing, stored procedures, and even introduces NoSQL with MongoDB. You'll leave with the skills to design and query any database.",
    progress: 0,
    lessons: sqlMeta.lessons,
    duration: sqlMeta.duration,
    thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800",
    category: "SQL & Databases",
    level: "Beginner",
    sections: sqlSections,
  },
  {
    id: "java-programming",
    title: "Java Programming Complete",
    instructor: "Bro Code",
    instructorAvatar: "BC",
    description: "Learn Java from scratch — OOP, Spring Boot, data structures, and backend development.",
    longDescription: "This complete Java path starts with syntax and object-oriented programming, then advances to professional backend development with Spring Boot and data structures. By the end, you'll be ready to build production-grade Java applications and ace technical interviews.",
    progress: 0,
    lessons: javaMeta.lessons,
    duration: javaMeta.duration,
    thumbnail: "https://images.unsplash.com/photo-1515879218367-8466d910aede?auto=format&fit=crop&q=80&w=800",
    category: "Java Programming",
    level: "Beginner",
    sections: javaSections,
  },
  {
    id: "artificial-intelligence",
    title: "Artificial Intelligence & Deep Learning",
    instructor: "Simplilearn",
    instructorAvatar: "SL",
    description: "AI fundamentals, deep learning, TensorFlow, NLP with transformers, and computer vision.",
    longDescription: "Explore the cutting edge of technology. This course covers AI fundamentals, deep learning architectures, practical TensorFlow projects, natural language processing with transformers, and computer vision with OpenCV. You'll build intelligent systems that can see, read, and reason.",
    progress: 0,
    lessons: aiMeta.lessons,
    duration: aiMeta.duration,
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800",
    category: "Artificial Intelligence",
    level: "Advanced",
    sections: aiSections,
  },
];

export const CATEGORIES = [
  "All",
  "Full Stack Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Python Programming",
  "Java Programming",
  "Web Development",
  "SQL & Databases",
];

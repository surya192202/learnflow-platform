const mysql = require('mysql2/promise');
require('dotenv').config();

const ASSIGNMENT_DATA = {
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

async function seed() {
  console.log('🚀 Connecting to Aiven MySQL for seeding...');
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log('✅ Connected. Clearing old data...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('TRUNCATE TABLE progress');
    await connection.execute('TRUNCATE TABLE videos');
    await connection.execute('TRUNCATE TABLE sections');
    await connection.execute('TRUNCATE TABLE subjects');
    await connection.execute('TRUNCATE TABLE assignments');
    await connection.execute('TRUNCATE TABLE practice_questions');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    const subjects = [
      { slug: 'full-stack-development', title: 'Full Stack Web Development', instructor: 'freeCodeCamp', level: 'Beginner', thumbnail: 'https://images.unsplash.com/photo-1627398242149-179d1e1e23b4?auto=format&fit=crop&q=80&w=800', description: 'Master HTML, CSS, JavaScript, React, Node.js, Express, and MySQL to become a full stack developer.' },
      { slug: 'data-science', title: 'Data Science with Python', instructor: 'freeCodeCamp', level: 'Beginner', thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', description: 'Learn Python, NumPy, Pandas, Matplotlib, statistics, and machine learning fundamentals.' },
      { slug: 'machine-learning', title: 'Machine Learning A-Z', instructor: 'Tech With Tim', level: 'Intermediate', thumbnail: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?auto=format&fit=crop&q=80&w=800', description: 'From regression to neural networks — learn practical machine learning with scikit-learn.' },
      { slug: 'python-programming', title: 'Python Programming Masterclass', instructor: 'Programming with Mosh', level: 'Beginner', thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&q=80&w=800', description: 'Complete Python course covering basics, OOP, file handling, decorators, and real-world projects.' },
      { slug: 'web-development', title: 'Modern Web Development', instructor: 'Traversy Media', level: 'Beginner', thumbnail: 'https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80&w=800', description: 'Build responsive websites with HTML, CSS, JavaScript, Tailwind CSS, and Next.js.' },
      { slug: 'sql-databases', title: 'SQL & Database Engineering', instructor: 'freeCodeCamp', level: 'Beginner', thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&q=80&w=800', description: 'Master SQL queries, database design, normalization, and explore NoSQL with MongoDB.' },
      { slug: 'java-programming', title: 'Java Programming Complete', instructor: 'Bro Code', level: 'Beginner', thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aede?auto=format&fit=crop&q=80&w=800', description: 'Learn Java from scratch — OOP, Spring Boot, data structures, and backend development.' },
      { slug: 'artificial-intelligence', title: 'Artificial Intelligence & Deep Learning', instructor: 'Simplilearn', level: 'Advanced', thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800', description: 'AI fundamentals, deep learning, TensorFlow, NLP with transformers, and computer vision.' },
      { slug: 'react-development', title: 'React Professional Developer', instructor: 'Codevolution', level: 'Intermediate', thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800', description: 'Master React, hooks, state management, and Next.js.' },
      { slug: 'nodejs-backend', title: 'Node.js Backend Architecture', instructor: 'Maximilian Schwarzmüller', level: 'Advanced', thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=800', description: 'Advanced backend development with Node.js, Express, microservices, and APIs.' },
      { slug: 'cloud-computing', title: 'Cloud Computing with AWS', instructor: 'Stephane Maarek', level: 'Beginner', thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800', description: 'Learn cloud infrastructure, deploying apps, serverless, and cloud databases.' },
      { slug: 'devops-fundamentals', title: 'DevOps & CI/CD Masterclass', instructor: 'TechWorld with Nana', level: 'Intermediate', thumbnail: 'https://images.unsplash.com/photo-1618401479427-c8ef9465fbe1?auto=format&fit=crop&q=80&w=800', description: 'Docker, Kubernetes, Jenkins, GitHub Actions, and continuous integration.' },
      { slug: 'cyber-security', title: 'Cyber Security & Ethical Hacking', instructor: 'NetworkChuck', level: 'Beginner', thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800', description: 'Network security, penetration testing, cryptography, and securing applications.' },
    ];

    const courseData = {
      'full-stack-development': [
        { title: 'HTML & CSS Foundations', orderIndex: 1, videos: [
          { title: 'HTML Crash Course', youtubeUrl: 'https://www.youtube.com/embed/qz0aGYrrlhU', orderIndex: 1, duration: 4098 },
          { title: 'CSS Full Course', youtubeUrl: 'https://www.youtube.com/embed/OXGznpKZ_sA', orderIndex: 2, duration: 5103 },
          { title: 'Flexbox & Grid Layout', youtubeUrl: 'https://www.youtube.com/embed/phWxA89Dy94', orderIndex: 3, duration: 2730 },
        ]},
        { title: 'JavaScript Core', orderIndex: 2, videos: [
          { title: 'JavaScript Full Course', youtubeUrl: 'https://www.youtube.com/embed/PkZNo7MFNFg', orderIndex: 1, duration: 8052 },
          { title: 'ES6+ Modern JavaScript', youtubeUrl: 'https://www.youtube.com/embed/NCwa_xi0Uuc', orderIndex: 2, duration: 3130 },
        ]},
        { title: 'React & Frontend', orderIndex: 3, videos: [
          { title: 'React JS Full Course', youtubeUrl: 'https://www.youtube.com/embed/bMknfKXIFA8', orderIndex: 1, duration: 8580 },
          { title: 'React Hooks Deep Dive', youtubeUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q', orderIndex: 2, duration: 2295 },
        ]},
        { title: 'Backend with Node & Express', orderIndex: 4, videos: [
          { title: 'Node.js Full Course', youtubeUrl: 'https://www.youtube.com/embed/Oe421EPjeBE', orderIndex: 1, duration: 6000 },
          { title: 'Express.js Crash Course', youtubeUrl: 'https://www.youtube.com/embed/SccSCuHhOw0', orderIndex: 2, duration: 2118 },
          { title: 'MySQL & Database Design', youtubeUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY', orderIndex: 3, duration: 3600 },
        ]},
      ],
      'data-science': [
        { title: 'Python Essentials', orderIndex: 1, videos: [
          { title: 'Python for Beginners', youtubeUrl: 'https://www.youtube.com/embed/kqtD5dpn9C8', orderIndex: 1, duration: 3600 },
          { title: 'Python Data Structures', youtubeUrl: 'https://www.youtube.com/embed/8DvywoWv6fI', orderIndex: 2, duration: 2700 },
        ]},
        { title: 'Data Analysis Libraries', orderIndex: 2, videos: [
          { title: 'NumPy Full Tutorial', youtubeUrl: 'https://www.youtube.com/embed/QUT1VHiLmmI', orderIndex: 1, duration: 3490 },
          { title: 'Pandas Complete Guide', youtubeUrl: 'https://www.youtube.com/embed/vmEHCJofslg', orderIndex: 2, duration: 4200 },
          { title: 'Data Visualization with Matplotlib', youtubeUrl: 'https://www.youtube.com/embed/3Xc3CA655Y4', orderIndex: 3, duration: 2031 },
        ]},
        { title: 'Statistics & ML Intro', orderIndex: 3, videos: [
          { title: 'Statistics for Data Science', youtubeUrl: 'https://www.youtube.com/embed/xxpc-HPKN28', orderIndex: 1, duration: 3960 },
          { title: 'Machine Learning in 2 Hours', youtubeUrl: 'https://www.youtube.com/embed/7eh4d6sabA0', orderIndex: 2, duration: 7200 },
        ]},
      ],
      'machine-learning': [
        { title: 'ML Foundations', orderIndex: 1, videos: [
          { title: 'Machine Learning Basics', youtubeUrl: 'https://www.youtube.com/embed/ukzFI9rgwfU', orderIndex: 1, duration: 5400 },
          { title: 'Linear & Logistic Regression', youtubeUrl: 'https://www.youtube.com/embed/VmbA0WUc-9I', orderIndex: 2, duration: 2900 },
        ]},
        { title: 'Advanced Algorithms', orderIndex: 2, videos: [
          { title: 'Decision Trees & Random Forests', youtubeUrl: 'https://www.youtube.com/embed/7VeUPuFGJHk', orderIndex: 1, duration: 2520 },
          { title: 'Neural Networks Explained', youtubeUrl: 'https://www.youtube.com/embed/aircAruvnKk', orderIndex: 2, duration: 3300 },
          { title: 'Scikit-Learn Full Tutorial', youtubeUrl: 'https://www.youtube.com/embed/pqNCD_5r0IU', orderIndex: 3, duration: 4320 },
        ]},
      ],
      'python-programming': [
        { title: 'Getting Started', orderIndex: 1, videos: [
          { title: 'Python Full Course for Beginners', youtubeUrl: 'https://www.youtube.com/embed/XKHEtdqhLK8', orderIndex: 1, duration: 14400 },
          { title: 'Python OOP Concepts', youtubeUrl: 'https://www.youtube.com/embed/JeznW_7DlB0', orderIndex: 2, duration: 3180 },
        ]},
        { title: 'Intermediate Python', orderIndex: 2, videos: [
          { title: 'File Handling & Exceptions', youtubeUrl: 'https://www.youtube.com/embed/HYrXogLj7vg', orderIndex: 1, duration: 1680 },
          { title: 'Python Decorators & Generators', youtubeUrl: 'https://www.youtube.com/embed/FsAPt_9Bf3U', orderIndex: 2, duration: 2100 },
          { title: 'Python Projects for Practice', youtubeUrl: 'https://www.youtube.com/embed/8ext9G7xspg', orderIndex: 3, duration: 10800 },
        ]},
      ],
      'web-development': [
        { title: 'Frontend Essentials', orderIndex: 1, videos: [
          { title: 'HTML & CSS for Beginners', youtubeUrl: 'https://www.youtube.com/embed/mU6anWqZJcc', orderIndex: 1, duration: 3600 },
          { title: 'JavaScript DOM Manipulation', youtubeUrl: 'https://www.youtube.com/embed/5fb2aPlgoys', orderIndex: 2, duration: 2400 },
          { title: 'Responsive Design', youtubeUrl: 'https://www.youtube.com/embed/srvUrASNj0s', orderIndex: 3, duration: 1680 },
        ]},
        { title: 'Modern Frameworks', orderIndex: 2, videos: [
          { title: 'Tailwind CSS Crash Course', youtubeUrl: 'https://www.youtube.com/embed/UBOj6rqRUME', orderIndex: 1, duration: 2280 },
          { title: 'Next.js Full Tutorial', youtubeUrl: 'https://www.youtube.com/embed/mTz0GXj8NN0', orderIndex: 2, duration: 4500 },
        ]},
      ],
      'sql-databases': [
        { title: 'SQL Fundamentals', orderIndex: 1, videos: [
          { title: 'SQL Full Course', youtubeUrl: 'https://www.youtube.com/embed/HXV3zeQKqGY', orderIndex: 1, duration: 15300 },
          { title: 'Database Design & Normalization', youtubeUrl: 'https://www.youtube.com/embed/ztHopE5Wnpc', orderIndex: 2, duration: 2400 },
        ]},
        { title: 'Advanced SQL', orderIndex: 2, videos: [
          { title: 'Advanced SQL Queries', youtubeUrl: 'https://www.youtube.com/embed/M-55BmjOuXY', orderIndex: 1, duration: 3120 },
          { title: 'MongoDB Crash Course', youtubeUrl: 'https://www.youtube.com/embed/ofme2o29ngU', orderIndex: 2, duration: 2160 },
        ]},
      ],
      'java-programming': [
        { title: 'Java Basics', orderIndex: 1, videos: [
          { title: 'Java Full Course', youtubeUrl: 'https://www.youtube.com/embed/eIrMbAQSU34', orderIndex: 1, duration: 8640 },
          { title: 'Java OOP Deep Dive', youtubeUrl: 'https://www.youtube.com/embed/6T_HgnjoYwM', orderIndex: 2, duration: 5760 },
        ]},
        { title: 'Java Backend', orderIndex: 2, videos: [
          { title: 'Spring Boot Tutorial', youtubeUrl: 'https://www.youtube.com/embed/9SGDpanrc8U', orderIndex: 1, duration: 4800 },
          { title: 'Java Data Structures', youtubeUrl: 'https://www.youtube.com/embed/RBSGKlAvoiM', orderIndex: 2, duration: 2880 },
        ]},
      ],
      'artificial-intelligence': [
        { title: 'AI Fundamentals', orderIndex: 1, videos: [
          { title: 'Artificial Intelligence Full Course', youtubeUrl: 'https://www.youtube.com/embed/JMUxmLyrhSk', orderIndex: 1, duration: 14400 },
          { title: 'Deep Learning Crash Course', youtubeUrl: 'https://www.youtube.com/embed/VyWAvY2CF9c', orderIndex: 2, duration: 3600 },
        ]},
        { title: 'Applied AI', orderIndex: 2, videos: [
          { title: 'TensorFlow 2.0 Tutorial', youtubeUrl: 'https://www.youtube.com/embed/tPYj3fFJGjk', orderIndex: 1, duration: 4500 },
          { title: 'NLP with Transformers', youtubeUrl: 'https://www.youtube.com/embed/N_8pu37w9BY', orderIndex: 2, duration: 3300 },
          { title: 'Computer Vision with OpenCV', youtubeUrl: 'https://www.youtube.com/embed/oXlwWbU8l2o', orderIndex: 3, duration: 3960 },
        ]},
      ],
      'react-development': [
        { title: 'React Fundamentals', orderIndex: 1, videos: [
          { title: 'React JS Crash Course', youtubeUrl: 'https://www.youtube.com/embed/w7ejDZ8SWv8', orderIndex: 1, duration: 5400 },
          { title: 'React Hooks Explained', youtubeUrl: 'https://www.youtube.com/embed/TNhaISOUy6Q', orderIndex: 2, duration: 2400 },
        ]},
        { title: 'Advanced React', orderIndex: 2, videos: [
          { title: 'State Management with Redux', youtubeUrl: 'https://www.youtube.com/embed/9boMnm5X9ak', orderIndex: 1, duration: 3600 },
        ]}
      ],
      'nodejs-backend': [
        { title: 'Node.js Basics', orderIndex: 1, videos: [
          { title: 'Node.js Complete Course', youtubeUrl: 'https://www.youtube.com/embed/Oe421EPjeBE', orderIndex: 1, duration: 7200 },
        ]},
        { title: 'API Development', orderIndex: 2, videos: [
          { title: 'Build REST APIs', youtubeUrl: 'https://www.youtube.com/embed/pKd0Rpw7O48', orderIndex: 1, duration: 5400 },
        ]}
      ],
      'cloud-computing': [
        { title: 'AWS Cloud Intro', orderIndex: 1, videos: [
          { title: 'AWS Certified Cloud Practitioner', youtubeUrl: 'https://www.youtube.com/embed/3hLmDS179YE', orderIndex: 1, duration: 14400 },
        ]},
        { title: 'Cloud Architecture', orderIndex: 2, videos: [
          { title: 'AWS EC2, S3, & VPCs', youtubeUrl: 'https://www.youtube.com/embed/k1EYcjzgQi0', orderIndex: 1, duration: 7200 },
        ]}
      ],
      'devops-fundamentals': [
        { title: 'Containerization', orderIndex: 1, videos: [
          { title: 'Docker Tutorial for Beginners', youtubeUrl: 'https://www.youtube.com/embed/pTFZFxd4hOI', orderIndex: 1, duration: 7200 },
        ]},
        { title: 'Orchestration & CI/CD', orderIndex: 2, videos: [
          { title: 'Kubernetes Crash Course', youtubeUrl: 'https://www.youtube.com/embed/X48VuDVv0do', orderIndex: 1, duration: 9000 },
        ]}
      ],
      'cyber-security': [
        { title: 'Security Basics', orderIndex: 1, videos: [
          { title: 'Cyber Security Full Course', youtubeUrl: 'https://www.youtube.com/embed/U_P23SqJaDc', orderIndex: 1, duration: 43200 },
        ]},
        { title: 'Penetration Testing', orderIndex: 2, videos: [
          { title: 'Ethical Hacking Crash Course', youtubeUrl: 'https://www.youtube.com/embed/fNzpcB7ODxQ', orderIndex: 1, duration: 10800 },
        ]}
      ],
    };

    // Insert subjects
    for (const sub of subjects) {
      const [result] = await connection.execute(
        'INSERT INTO subjects (title, slug, description, thumbnail, level, instructor, is_published) VALUES (?, ?, ?, ?, ?, ?, TRUE)',
        [sub.title, sub.slug, sub.description, sub.thumbnail, sub.level, sub.instructor]
      );
      const subjectId = result.insertId;
      console.log(`  ✓ Subject: ${sub.title} (id=${subjectId})`);

      // Insert assignments
      const assign = ASSIGNMENT_DATA[sub.slug];
      if (assign) {
        await connection.execute(
          'INSERT INTO assignments (subject_id, title, description, objective, submission_format, duration_estimate) VALUES (?, ?, ?, ?, ?, ?)',
          [subjectId, assign.title, assign.description, assign.objective, assign.format, assign.duration]
        );
        console.log(`    → Assignment seeded`);
      }

      // Insert mock practice questions (3 per subject)
      const questions = [
        { q: `What is the primary goal of ${sub.title}?`, a: 'To build skills', b: 'To waste time', c: 'To sleep', d: 'To eat', correct: 'a' },
        { q: `Which instructor teaches ${sub.title}?`, a: 'Unknown', b: sub.instructor, c: 'AI', d: 'Nobody', correct: 'b' },
        { q: `Is ${sub.title} a ${sub.level} level course?`, a: 'Yes', b: 'No', c: 'Maybe', d: 'I don\'t know', correct: 'a' },
      ];

      for (const q of questions) {
        await connection.execute(
          'INSERT INTO practice_questions (subject_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [subjectId, q.q, q.a, q.b, q.c, q.d, q.correct]
        );
      }
      console.log(`    → 3 practice questions seeded`);

      const sectionsList = courseData[sub.slug];
      if (!sectionsList) continue;

      for (const sec of sectionsList) {
        const [secResult] = await connection.execute(
          'INSERT INTO sections (subject_id, title, order_index) VALUES (?, ?, ?)',
          [subjectId, sec.title, sec.orderIndex]
        );
        const sectionId = secResult.insertId;

        for (const vid of sec.videos) {
          await connection.execute(
            'INSERT INTO videos (section_id, title, description, youtube_url, order_index, duration_seconds) VALUES (?, ?, ?, ?, ?, ?)',
            [sectionId, vid.title, '', vid.youtubeUrl, vid.orderIndex, vid.duration]
          );
        }
      }
    }

    console.log('\n✅ Database seeded successfully with Aiven MySQL!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await connection.end();
  }
}

seed();

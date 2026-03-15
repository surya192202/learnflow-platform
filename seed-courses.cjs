const mysql = require('mysql2/promise');
require('dotenv').config();

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'lms_db',
  });

  try {
    console.log('Connected. Clearing old data...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    await connection.execute('TRUNCATE TABLE progress');
    await connection.execute('TRUNCATE TABLE videos');
    await connection.execute('TRUNCATE TABLE sections');
    await connection.execute('TRUNCATE TABLE subjects');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    const subjects = [
      { slug: 'full-stack-development', title: 'Full Stack Web Development', description: 'Master HTML, CSS, JavaScript, React, Node.js, Express, and MySQL to become a full stack developer.' },
      { slug: 'data-science', title: 'Data Science with Python', description: 'Learn Python, NumPy, Pandas, Matplotlib, statistics, and machine learning fundamentals.' },
      { slug: 'machine-learning', title: 'Machine Learning A-Z', description: 'From regression to neural networks — learn practical machine learning with scikit-learn.' },
      { slug: 'python-programming', title: 'Python Programming Masterclass', description: 'Complete Python course covering basics, OOP, file handling, decorators, and real-world projects.' },
      { slug: 'web-development', title: 'Modern Web Development', description: 'Build responsive websites with HTML, CSS, JavaScript, Tailwind CSS, and Next.js.' },
      { slug: 'sql-databases', title: 'SQL & Database Engineering', description: 'Master SQL queries, database design, normalization, and explore NoSQL with MongoDB.' },
      { slug: 'java-programming', title: 'Java Programming Complete', description: 'Learn Java from scratch — OOP, Spring Boot, data structures, and backend development.' },
      { slug: 'artificial-intelligence', title: 'Artificial Intelligence & Deep Learning', description: 'AI fundamentals, deep learning, TensorFlow, NLP with transformers, and computer vision.' },
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
    };

    // Insert subjects
    for (const sub of subjects) {
      const [result] = await connection.execute(
        'INSERT INTO subjects (title, slug, description, is_published) VALUES (?, ?, ?, TRUE)',
        [sub.title, sub.slug, sub.description]
      );
      const subjectId = result.insertId;
      console.log(`  ✓ Subject: ${sub.title} (id=${subjectId})`);

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

    console.log('\n✅ Database seeded successfully with 8 courses!');
  } catch (err) {
    console.error('Seed error:', err);
  } finally {
    await connection.end();
  }
}

seed();

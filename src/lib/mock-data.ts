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
  sections: Section[];
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  enrolledSubjects: string[];
  recentLessons: { subjectId: string; lessonId: string; title: string; subjectTitle: string; date: string }[];
}

const createSections = (subjectId: string): Section[] => [
  {
    id: `${subjectId}-s1`,
    title: "Getting Started",
    lessons: [
      { id: `${subjectId}-l1`, title: "Introduction & Overview", duration: "8:30", completed: true, locked: false, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Welcome to this course. In this lesson, we cover the key concepts you'll learn and set expectations for the journey ahead." },
      { id: `${subjectId}-l2`, title: "Setting Up Your Environment", duration: "12:15", completed: true, locked: false, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Configure your development environment with the right tools and dependencies to follow along with the course." },
      { id: `${subjectId}-l3`, title: "Core Concepts", duration: "15:42", completed: false, locked: false, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Dive into the fundamental concepts that form the foundation of everything we'll build in this course." },
    ],
  },
  {
    id: `${subjectId}-s2`,
    title: "Fundamentals",
    lessons: [
      { id: `${subjectId}-l4`, title: "Building Blocks", duration: "18:20", completed: false, locked: false, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Learn the essential building blocks and how they connect to form larger systems." },
      { id: `${subjectId}-l5`, title: "Patterns & Best Practices", duration: "22:10", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Discover industry-proven patterns and best practices that will elevate your work." },
      { id: `${subjectId}-l6`, title: "Hands-on Exercise", duration: "30:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Apply what you've learned in a guided hands-on exercise." },
    ],
  },
  {
    id: `${subjectId}-s3`,
    title: "Advanced Topics",
    lessons: [
      { id: `${subjectId}-l7`, title: "Advanced Techniques", duration: "25:30", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "Push your skills further with advanced techniques used by professionals." },
      { id: `${subjectId}-l8`, title: "Real-World Application", duration: "35:00", completed: false, locked: true, videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", description: "See how everything comes together in a real-world project." },
    ],
  },
];

export const SUBJECTS: Subject[] = [
  {
    id: "design-systems-101",
    title: "Design Systems for Scale",
    instructor: "Elena Torro",
    instructorAvatar: "ET",
    description: "Learn to build robust, scalable design systems using Figma and React.",
    longDescription: "This comprehensive course takes you through every layer of building a production-grade design system. From design tokens and component architecture to documentation and governance, you'll learn the strategies used by teams at Airbnb, Shopify, and GitHub. By the end, you'll have built a fully functional design system that scales across products and teams.",
    progress: 45,
    lessons: 24,
    duration: "12h 30m",
    thumbnail: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800",
    category: "Design",
    sections: createSections("design-systems"),
  },
  {
    id: "react-advanced",
    title: "Advanced React Patterns",
    instructor: "Marcus Chen",
    instructorAvatar: "MC",
    description: "Master compound components, render props, and advanced hooks patterns.",
    longDescription: "Go beyond the basics of React and learn the patterns that power the most sophisticated UI libraries. This course covers compound components, render props, custom hooks, state machines, and performance optimization techniques that will make you a more effective React developer.",
    progress: 72,
    lessons: 18,
    duration: "9h 45m",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800",
    category: "Development",
    sections: createSections("react-advanced"),
  },
  {
    id: "data-visualization",
    title: "Data Visualization with D3",
    instructor: "Sarah Park",
    instructorAvatar: "SP",
    description: "Create stunning, interactive data visualizations for the modern web.",
    longDescription: "Transform raw data into compelling visual stories. This course teaches you D3.js from the ground up, covering SVG fundamentals, scales, axes, transitions, and interactive charts. You'll build a portfolio of data visualizations that communicate insights effectively.",
    progress: 0,
    lessons: 20,
    duration: "11h 15m",
    thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    category: "Data",
    sections: createSections("data-viz"),
  },
  {
    id: "typescript-mastery",
    title: "TypeScript Mastery",
    instructor: "James Wright",
    instructorAvatar: "JW",
    description: "From generics to conditional types — become a TypeScript expert.",
    longDescription: "TypeScript is the backbone of modern web development. This course covers advanced type system features including generics, mapped types, conditional types, template literal types, and type-safe API design. Build the confidence to tackle any typing challenge.",
    progress: 30,
    lessons: 22,
    duration: "10h 20m",
    thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&q=80&w=800",
    category: "Development",
    sections: createSections("typescript"),
  },
  {
    id: "product-strategy",
    title: "Product Strategy & Research",
    instructor: "Amira Hassan",
    instructorAvatar: "AH",
    description: "Learn frameworks for product discovery, validation, and go-to-market.",
    longDescription: "Build products people actually want. This course covers user research methods, jobs-to-be-done framework, competitive analysis, product-market fit measurement, and go-to-market strategy. Learn from real case studies of successful product launches.",
    progress: 15,
    lessons: 16,
    duration: "8h 00m",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
    category: "Product",
    sections: createSections("product"),
  },
  {
    id: "motion-design",
    title: "Motion Design for UI",
    instructor: "Luca Moretti",
    instructorAvatar: "LM",
    description: "Craft meaningful animations that enhance user experience and delight.",
    longDescription: "Great UI motion is invisible — it just feels right. This course teaches you the principles of motion design for interfaces, from micro-interactions to page transitions. You'll learn Framer Motion, CSS animations, and the psychology behind effective motion.",
    progress: 0,
    lessons: 14,
    duration: "7h 30m",
    thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
    category: "Design",
    sections: createSections("motion"),
  },
];

export const CATEGORIES = ["All", "Design", "Development", "Data", "Product"];

export const CURRENT_USER: User = {
  name: "Alex Morgan",
  email: "alex.morgan@email.com",
  avatar: "AM",
  enrolledSubjects: ["design-systems-101", "react-advanced", "typescript-mastery", "product-strategy"],
  recentLessons: [
    { subjectId: "react-advanced", lessonId: "react-advanced-l3", title: "Core Concepts", subjectTitle: "Advanced React Patterns", date: "2 hours ago" },
    { subjectId: "design-systems-101", lessonId: "design-systems-l2", title: "Setting Up Your Environment", subjectTitle: "Design Systems for Scale", date: "Yesterday" },
    { subjectId: "typescript-mastery", lessonId: "typescript-l1", title: "Introduction & Overview", subjectTitle: "TypeScript Mastery", date: "3 days ago" },
  ],
};

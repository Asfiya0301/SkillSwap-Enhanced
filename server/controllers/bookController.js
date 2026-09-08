const Book = require("../models/Book");

const defaultBooks = [
  {
    title: "Python Foundations",
    author: "SkillSwap Learning Desk",
    category: "Programming",
    price: 29,
    description: "A practical reading guide covering Python syntax, data structures, functions, files, and small projects.",
    readingNotes: [
      "Use variables to name values and choose clear, descriptive names.",
      "Lists keep ordered collections; dictionaries store key-value information.",
      "Functions package reusable logic and should usually do one clear job.",
      "Read errors from the last line first, then trace back to the responsible code.",
      "Practice by building small scripts such as a calculator, quiz, or file organizer."
    ],
    syllabus: [
      "1. Python syntax, variables, types, and operators",
      "2. Conditions, loops, lists, dictionaries, and sets",
      "3. Functions, modules, exceptions, and file handling",
      "4. A small project that solves a useful everyday problem"
    ],
    roadmap: [
      "Step 1: Install Python and run your first script",
      "Step 2: Practice data types and control flow",
      "Step 3: Write reusable functions and read files",
      "Step 4: Build and explain a small Python project",
      "Step 5: Share your questions and progress in a skill exchange"
    ],
    downloadUrl: "/books/python-foundations.pdf"
  },
  {
    title: "React Essentials",
    author: "A. Sharma",
    category: "Frontend",
    price: 25,
    description: "A practical guide to modern React patterns, hooks, reusable components, and app architecture.",
    downloadUrl: "/books/react-essentials.pdf"
  },
  {
    title: "Node API Design",
    author: "M. Patel",
    category: "Backend",
    price: 32,
    description: "Learn to design secure, scalable REST APIs, authentication, and production-ready backend workflows.",
    downloadUrl: "/books/node-api-design.pdf"
  },
  {
    title: "UI/UX Foundations",
    author: "R. Iyer",
    category: "Design",
    price: 18,
    description: "Understand user flows, clean interfaces, and design systems that improve product experience.",
    downloadUrl: "/books/ui-ux-foundations.pdf"
  },
  {
    title: "JavaScript in Practice",
    author: "SkillSwap Learning Desk",
    category: "Programming",
    price: 27,
    description: "Build a strong JavaScript foundation with modern syntax, asynchronous code, browser APIs, and practical projects.",
    readingNotes: [
      "Use const by default and let when a value must change.",
      "Promises and async/await help organize work that finishes later.",
      "Keep browser events small and move reusable logic into functions.",
      "Use the console and network tools to understand runtime behavior."
    ],
    syllabus: [
      "1. Values, variables, functions, and scope",
      "2. Arrays, objects, modules, and modern syntax",
      "3. Promises, async/await, and API requests",
      "4. Build a small interactive browser application"
    ],
    roadmap: [
      "Step 1: Practice syntax with short console exercises",
      "Step 2: Transform arrays and objects confidently",
      "Step 3: Fetch data from a public API",
      "Step 4: Build an interactive project and review it"
    ],
    downloadUrl: "/books/javascript-in-practice.pdf"
  },
  {
    title: "SQL and Data Basics",
    author: "N. Rao",
    category: "Data",
    price: 24,
    description: "Learn to query, filter, join, and summarize data so you can answer useful questions with confidence.",
    readingNotes: [
      "Start with the question you want the data to answer.",
      "Use WHERE to reduce rows before grouping or joining.",
      "Joins should be based on a clear relationship between tables.",
      "Check totals and sample rows before trusting a result."
    ],
    syllabus: [
      "1. Tables, rows, columns, and SELECT",
      "2. Filtering, sorting, grouping, and aggregates",
      "3. Joins, subqueries, and data quality checks",
      "4. Create a small reporting dashboard query"
    ],
    roadmap: [
      "Step 1: Write simple SELECT queries",
      "Step 2: Filter and summarize real datasets",
      "Step 3: Join related tables",
      "Step 4: Explain your findings to a learning partner"
    ],
    downloadUrl: "/books/sql-and-data-basics.pdf"
  },
  {
    title: "Git Collaboration Guide",
    author: "D. Mehta",
    category: "Developer Tools",
    price: 19,
    description: "Understand commits, branches, pull requests, and everyday collaboration habits for software projects.",
    readingNotes: [
      "A commit should describe one coherent change.",
      "Create a branch before experimenting on shared work.",
      "Pull before starting and review a diff before committing.",
      "A clear pull request explains what changed and how it was tested."
    ],
    syllabus: [
      "1. Repositories, commits, and history",
      "2. Branches, merges, and conflict resolution",
      "3. Pull requests and code review",
      "4. A team workflow for a small project"
    ],
    roadmap: [
      "Step 1: Create a repository and first commit",
      "Step 2: Work safely on a feature branch",
      "Step 3: Resolve a controlled merge conflict",
      "Step 4: Open and review a pull request"
    ],
    downloadUrl: "/books/git-collaboration-guide.pdf"
  },
  {
    title: "Data Analysis with Python",
    author: "K. Iyer",
    category: "Data",
    price: 34,
    description: "Move from Python fundamentals to practical data cleaning, exploration, visualization, and insight sharing.",
    readingNotes: [
      "Inspect missing values before calculating totals or averages.",
      "Keep raw data separate from cleaned and transformed data.",
      "A chart should answer a question, not simply decorate a report.",
      "Explain assumptions and limitations with every conclusion."
    ],
    syllabus: [
      "1. Loading and inspecting datasets",
      "2. Cleaning missing and inconsistent values",
      "3. Grouping, summarizing, and visualizing data",
      "4. Present a short evidence-based analysis"
    ],
    roadmap: [
      "Step 1: Load a small CSV dataset",
      "Step 2: Clean and inspect the columns",
      "Step 3: Find patterns with summaries and charts",
      "Step 4: Share the result and invite feedback"
    ],
    downloadUrl: "/books/data-analysis-with-python.pdf"
  }
];

const getBooks = async (req, res) => {
  try {
    let books = await Book.find().sort({ createdAt: 1 });
    const existingTitles = new Set(books.map((book) => book.title));
    const missingBooks = defaultBooks.filter((book) => !existingTitles.has(book.title));
    if (missingBooks.length > 0) await Book.insertMany(missingBooks);
    books = await Book.find().sort({ createdAt: 1 });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getBooks };
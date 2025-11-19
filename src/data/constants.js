export const projects = [
  {
    title: "Business Solution Discovery Chatbot (RAG-based)",
    description: [
      "Designed an end-to-end chatbot using Retrieval-Augmented Generation (RAG) to match users with tailored business solutions.",
      "Implemented semantic search with FAISS and SentenceTransformers; integrated LLaMA-3 via Groq API for real-time generation.",
      "Built a feedback-aware retraining pipeline using MySQL logs and CosineSimilarityLoss.",
      "Automated web scraping with Selenium and developed analytics dashboards with Matplotlib and Pandas.",
      "Deployed production backend on AWS EC2 and managed cloud database with RDS."
    ],
    tags: ["RAG", "FAISS", "LLaMA-3", "MySQL", "AWS EC2", "RDS", "Selenium", "Matplotlib", "Pandas"]
  },
  {
    title: "QuantFusion - AI-Powered Financial Intelligence Platform",
    description: [
      "Building a modular AI-powered finance platform integrating portfolio optimization, risk analytics, sentiment analysis, and algorithmic trading into a unified backend-frontend system.",
      "Developed FastAPI-based risk analysis supporting VaR, CVaR, volatility, drawdown, CAPM beta, and risk attribution using both historical and parametric methods.",
      "Implemented advanced portfolio construction strategies including Mean-Variance Optimization (Markowitz), Risk Parity, and Black-Litterman with real-world constraints like sector limits, weight bounds, and tracking error.",
      "Designing a React frontend for real-time dashboards, visualizations, and interactive model control.",
      "Roadmap includes deployment of options pricing models, a sentiment-driven market forecasting engine, and a rule-based trading module."
    ],
    tags: ["FastAPI", "React", "Portfolio Optimization", "Risk Analytics", "CAPM", "Markowitz", "Black-Litterman", "Sentiment Analysis"]
  },
  {
    title: "ChurnSight - End-to-End MLOps Pipeline",
    description: [
      "Developed a complete end-to-end MLOps pipeline for customer churn prediction with custom implementations of Logistic Regression, Decision Tree, Random Forest, XGBoost, MLP, and Gaussian Naive Bayes classifiers, and implemented a meta classifier using all the custom models.",
      "Automated hyperparameter tuning with Optuna and evaluated models using ROC-AUC and accuracy.",
      "Deployed FastAPI inference API with support for batch predictions and SHAP-based feature explanations.",
      "Containerized the app with Docker and integrated basic CI/CD workflows via GitHub Actions."
    ],
    tags: ["MLOps", "XGBoost", "FastAPI", "Docker", "SHAP", "Optuna", "GitHub Actions", "Meta Classifier"]
  },
  {
    title: "F1 Predictor - Driver Outcome Classification",
    description: [
      "Built a multithreaded data pipeline with FastF1 and ThreadPoolExecutor to collect historical F1 race, weather, and qualifying data.",
      "Trained a custom Random Forest classifier to predict driver categories (Top 3, Midfield, Backmarker) with 77% accuracy.",
      "Achieved 100% recall on Top 3 predictions; validated model with precision/recall scores and confusion matrix analysis."
    ],
    tags: ["Random Forest", "FastF1", "ThreadPoolExecutor", "Data Pipeline", "Classification", "Precision/Recall"]
  }
];

export const experience = [
  {
    company: "AINA",
    position: "Co-founder, CTO",
    period: "Oct 2024 - Present (Remote)",
    description: [
      "Developing our hackathon-winner idea into a business.",
      "Building an app where users can get outfits rated by stylist personas and share them in a social media environment.",
      "Responsible for the full-stack Flutter + Supabase, and the AI rating system as CTO.",
      "Currently has 100+ users worldwide."
    ]
  },
  {
    company: "Digitopia",
    position: "AI Engineering Intern",
    period: "May 2025 - Present (Hybrid - Beyoglu/Istanbul)",
    description: [
      "Coded several chatbots to help customers understand DMI scores, motivate with success stories, provide step-by-step plans, and guide execution.",
      "Created an orchestration for chatbots in a single, tool-calling workflow.",
      "Working on automating scoring and recommendation pipeline by transcribing meetings and providing output."
    ]
  },
  {
    company: "Promake AI",
    position: "AI Engineering Intern",
    period: "Aug 2025 - Present (Remote)",
    description: [
      "Working on a workflow to create custom websites for non-technical customers.",
      "Created multiple agents for LangGraph workflow, including orchestrator, UI management, language management, and web searching/scraping."
    ]
  },
  {
    company: "Exin Health AI",
    position: "AI Engineering Intern",
    period: "June 2025 - Aug 2025 (Remote)",
    description: [
      "Helped develop an iOS mobile app for digitalizing operation rooms and simplifying form filling using ASR, vision recognition, OCR, and LLMs.",
      "Implemented an LLM-as-a-judge system in LangGraph to decrease hallucinations by +90%.",
      "Created a thorough testing suite to automate endpoint testing for voice and image recognition."
    ]
  },
  {
    company: "Genarion",
    position: "AI Engineering Intern",
    period: "Feb 2025 - May 2025 (Remote)",
    description: [
      "Worked on software applications based on LLM.",
      "Wrote an automatic interview script generating questions for evaluating hard and soft skills based on job posts, CVs, and previous answers using TTS and STT.",
      "Created automatic scripts that downloads Turkish audio-books, transcribes and chunks it for a dataset in order to finetune multiple TTS models to speak Turkish naturally."
    ]
  },
  {
    company: "Forma Makine",
    position: "Machine Learning Intern",
    period: "Dec 2024 - Feb 2025 (Remote)",
    description: [
      "Learnt about statistics and mathematics of the machine learning algorithms."
    ]
  }
];

export const education = [
  {
    institution: "Koç University",
    degree: "BEng in Computer Engineering",
    period: "Sept 2022 - June 2026",
    description: "GPA: 3.83 • Vehbi Koç Honor List"
  },
  {
    institution: "Koç University",
    degree: "BBA in Business Administration",
    period: "Jan 2024 - June 2027",
    description: "GPA: 3.83 • Vehbi Koç Honor List"
  },
  {
    institution: "Kungliga Tekniska Högskolan",
    degree: "Erasmus+ Exchange",
    period: "Aug 2025 - Feb 2026",
    description: ""
  }
];

export const skills = [
  "Machine Learning", "MLOps", "Generative AI", "Quantitative Analysis", "FastAPI", "Docker", "AWS EC2/RDS", "LangGraph", "MLflow", "Feedback-aware Fine-tuning", "Object-Oriented Programming", "Data Structures", "UI/UX", "Teamwork", "Flutter", "Supabase", "Vision Recognition", "OCR", "LLMs", "ASR", "TTS", "Selenium", "Matplotlib", "Pandas", "Optuna", "SHAP", "CI/CD", "GitHub Actions", "Python", "English (C1 Advanced - KUEPE: 91)", "Turkish (Native)"
];


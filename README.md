![React](https://img.shields.io/badge/React-19-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite)
![Express](https://img.shields.io/badge/Express.js-black?logo=express)
![Groq](https://img.shields.io/badge/Groq-Llama%203.1-orange)
![License](https://img.shields.io/badge/License-MIT-green)
# 📚 Study Assistant

An AI-powered study assistant that transforms notes or topics into interactive flashcards and quizzes using the Groq API powered by Meta Llama 3.1. Designed to help students learn faster through active recall and self-assessment.

## 🌐 Live Demo

🔗 https://study-assistant-j10m.onrender.com/

---

## ✨ Features

- 📖 Generate AI-powered flashcards from notes or a topic
- ❓ Create interactive multiple-choice quizzes
- 🔄 Flip flashcards for active recall learning
- 🌙 Light/Dark mode support
- ⚡ Fast AI response generation using Groq (Llama 3.1)
- 🛡️ JSON validation with automatic retry mechanism
- 📱 Responsive UI for desktop and mobile
- 🚨 Error handling for invalid AI responses

---
## 🤖 AI Usage

## 🤖 AI Usage

AI tools (ChatGPT and GitHub Copilot) were used during development for brainstorming, debugging, UI refinement, and documentation. The application uses the Groq API (Meta Llama 3.1) to generate structured flashcards and quizzes. All architecture decisions, implementation, integration, testing, and final code modifications were completed and verified by the author.
---

## 📸 Screenshots

### 🏠 Home Page

![Home](./screenshots/home.png)

---

### 📚 Flashcards

![Flashcards](./screenshots/flashcards.png)

---

### 🔄 Flashcard Flip

![Flashcard Flip](./screenshots/flashcard-flip.png)

---

### ❓ Quiz

![Quiz](./screenshots/quiz.png)

---
## 🎥 Demo Video

https://drive.google.com/file/d/1TAuT2x2vu_ormplBApVNHnmfykodaHYM/view?usp=drive_link

---

## 🛠 Tech Stack

### Frontend

- React
- Vite
- CSS3

### Backend

- Node.js
- Express.js

### AI

- Groq API (Meta Llama 3.1 Instant)

### Deployment

- Render

---

## 📂 Project Structure

```
study-assistant/
│
├── src/
│   ├── components/
│   ├── api/
│   ├── utils/
│   ├── App.jsx
│   └── index.css
│
├── server/
│
├── public/
│
├── package.json
└── README.md
```

---

## ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/TheAkshatGupta/study-assistant.git
```

Go to project folder

```bash
cd study-assistant
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PROVIDER=groq
API_KEY=YOUR_GROQ_API_KEY
MODEL=llama-3.1-8b-instant
```

Start development server

```bash
npm run dev
```

Start backend

```bash
npm start
```

---

## 🧠 How It Works

1. User enters notes or a topic.
2. Notes are sent securely to the Groq API.
3. AI generates:
   - Flashcards
   - Quiz Questions
4. The server validates the JSON response.
5. Valid data is displayed as interactive flashcards and quizzes.

---

## 🚀 Future Improvements

- PDF Notes Upload
- Export Flashcards as PDF
- Save Study History
- User Authentication
- Progress Tracking
- Spaced Repetition System

---

## ⚠️ Limitations

- Internet connection required
- Requires a Groq API key
- AI-generated content should be reviewed before studying

---

## 👨‍💻 Author

**Akshat Gupta**

GitHub: https://github.com/TheAkshatGupta

LinkedIn: https://www.linkedin.com/in/akshat-gupta-csds

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

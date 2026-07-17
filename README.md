# AI Study Assistant

AI-powered study assistant that converts notes into flashcards and quizzes using LLMs.

## Features

- Generate flashcards
- Interactive quiz
- Supports Gemini, Groq, OpenAI, OpenRouter, Anthropic and Ollama
- Dark Mode
- JSON validation with retry

## Tech Stack

- React
- Vite
- Express
- Node.js
- Gemini API

## Installation

```bash
npm install
```

Create `.env`

```env
PROVIDER=gemini
API_KEY=YOUR_API_KEY
```

Run

```bash
npm start
```

Open

```
http://localhost:5173
```

## AI Usage

This application sends user notes to an LLM (Gemini/Groq/OpenAI etc.) to generate structured flashcards and quizzes. Responses are validated against a predefined JSON schema before being displayed.

## Limitations

- Requires an internet connection
- Depends on third-party AI providers
- AI responses may occasionally require regeneration
- API key required

## Time Spent

Approximately **8–10 hours**

## Screenshots

(Add screenshots)

## Demo

(Add screen recording link)

## Author

Akshat Gupta
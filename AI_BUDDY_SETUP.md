# AI Buddy setup

The project now includes an isolated floating AI Buddy chatbot.

## What changed
- Added `POST /api/chat` as a separate backend endpoint.
- Added a separate `ChatService`; the existing `/api/generate` flow was not changed.
- Added a floating React AI Buddy chat window with conversation memory on the client.
- Follow-up requests such as `explain this in the simplest form` use the previous messages.
- The OpenAI API key stays on the backend.

## Run locally
### Backend
1. Make sure Java 17 and Maven are installed.
2. Create `backend/.env` from `backend/.env.example`.
3. Put your existing OpenAI API key in `OPENAI_API_KEY`.
4. From `backend`, run:
   `mvn spring-boot:run`

### Frontend
1. From `frontend`, run:
   `npm install`
2. Then run:
   `npm run dev`
3. Open the Vite URL shown in the terminal.

The chatbot calls `http://localhost:8080/api/chat`, while the original website continues to use `http://localhost:8080/api/generate`.

## Important
`backend/.env` is intentionally not included in this ZIP. This prevents the API secret from being copied into another archive. Re-create it locally from `.env.example` before starting the backend.


# Firebase Studio - Cash Me If You Can

This is a Next.js trivia game application built in Firebase Studio.

To get started, navigate to the home page (`/`) to select game options and then click "Play Now" which will take you to `/play`.
The main application logic is within the `src` directory.
Look at `src/app/page.tsx` for the home page and `src/app/play/page.tsx` for the game area.
AI-powered question generation is handled by Genkit flows in `src/ai/flows/`.
Game state management is in `src/hooks/use-game-state.ts`.
UI components are in `src/components/`.
Firebase authentication handles user sign-up and sign-in.

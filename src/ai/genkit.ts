
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';


const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!geminiApiKey && process.env.NODE_ENV === 'development') {
  
  console.warn(
    `\n[Genkit Setup Warning]
    GEMINI_API_KEY (or GOOGLE_API_KEY) is not set in your environment.
    Genkit's Google AI plugin might not be able to connect to Google AI services.
    - For local development: Ensure this key is set in your .env file.
    - For deployment: Ensure this key is set as an environment variable in your hosting platform.
    See https://firebase.google.com/docs/genkit/plugins/google-genai for more details.
    The application will still attempt to initialize Genkit, which might lead to errors if the key is missing in the execution environment.\n`
  );
}

export const ai = genkit({
  plugins: [
    googleAI({
      apiKey: geminiApiKey, 
    }),
  ],
  model: 'googleai/gemini-2.0-flash', 
});


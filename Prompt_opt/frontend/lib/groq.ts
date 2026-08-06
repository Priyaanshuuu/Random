import Groq from "groq-sdk";

import { env } from "./env";

/** Groq inference client. Requires GROQ_API_KEY. */
export const groq = new Groq({
  apiKey: env.GROQ_API_KEY,
});

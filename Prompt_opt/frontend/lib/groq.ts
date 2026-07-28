import Groq from "groq-sdk";

/** Groq inference client. Requires GROQ_API_KEY. */
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

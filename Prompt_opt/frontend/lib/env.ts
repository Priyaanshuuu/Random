/**
 * Validated server-side environment.
 *
 * Reading a missing key surfaces a named error at first use rather than an
 * opaque failure deep inside the Groq or Prisma client.
 */

function required(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `${name} is not set. Copy frontend/.env.example to frontend/.env and fill it in.`,
    );
  }

  return value;
}

export const env = {
  get GROQ_API_KEY() {
    return required("GROQ_API_KEY");
  },
  get DATABASE_URL() {
    return required("DATABASE_URL");
  },
};

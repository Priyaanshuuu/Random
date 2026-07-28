import { SCORE_BANDS } from "@/lib/constants";

export type ScoreTone = (typeof SCORE_BANDS)[number]["tone"];

/** Maps a 0-100 score onto its qualitative band and Tailwind color classes. */
export function getScoreBand(score: number) {
  const band =
    SCORE_BANDS.find((b) => score >= b.min) ?? SCORE_BANDS[SCORE_BANDS.length - 1];

  const styles: Record<ScoreTone, { text: string; bar: string }> = {
    success: { text: "text-success", bar: "bg-success" },
    warning: { text: "text-warning", bar: "bg-warning" },
    destructive: { text: "text-destructive", bar: "bg-destructive" },
  };

  return { ...band, ...styles[band.tone] };
}

type Props = {
  score: number;
  feedback: string;
};

export default function EvaluationCard({
  score,
  feedback,
}: Props) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <h2 className="text-xl font-bold">
        Score: {score}/100
      </h2>

      <p>{feedback}</p>
    </div>
  );
}
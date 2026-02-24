interface IntentTagProps {
  intent: string;
}

const formatIntent = (intent: string) =>
  intent.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

const IntentTag = ({ intent }: IntentTagProps) => {
  return (
    <span className="bg-primary/10 text-primary border border-primary/20 rounded-md px-2 py-0.5 text-xs">
      {formatIntent(intent)}
    </span>
  );
};

export default IntentTag;

interface InfoRowProps {
  label: string;
  value: string | undefined;
}

export default function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-baseline gap-1.5 min-w-0">
      <span className="text-xs text-foreground-400 shrink-0 whitespace-nowrap">{label}</span>
      <span className={`text-sm truncate ${value ? 'text-foreground-900' : 'text-foreground-300'}`}>
        {value || '\u2014'}
      </span>
    </div>
  );
}
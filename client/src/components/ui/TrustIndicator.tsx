interface TrustIndicatorProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function TrustIndicator({ icon, title, description }: TrustIndicatorProps) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors cursor-default">
      <div className="size-12 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <h3 className="font-bold text-lg text-white">{title}</h3>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
    </div>
  );
}

export default TrustIndicator;

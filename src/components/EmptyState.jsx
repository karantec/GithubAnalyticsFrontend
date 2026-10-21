export default function EmptyState({ icon = "📭", title, subtitle }) {
  return (
    <div className="py-16 text-center">
      <div className="text-4xl">{icon}</div>
      <h3 className="mt-3 text-lg font-semibold">{title}</h3>
      {subtitle && <p className="mt-1 text-sm text-slate-400">{subtitle}</p>}
    </div>
  );
}

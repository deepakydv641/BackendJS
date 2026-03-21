export default function Spinner({ fullScreen = false }) {
  const spinner = (
    <div className="flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-violet-500 animate-spin" />
    </div>
  );
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex items-center justify-center">
        {spinner}
      </div>
    );
  }
  return spinner;
}

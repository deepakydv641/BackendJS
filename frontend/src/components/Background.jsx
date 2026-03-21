/* Animated background blob orbs — import in pages */
export default function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      {/* Orb 1 */}
      <div className="orb-1 absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full opacity-25"
        style={{ background: 'radial-gradient(circle, #7c3aed 0%, #4f46e5 40%, transparent 70%)' }} />
      {/* Orb 2 */}
      <div className="orb-2 absolute -bottom-40 -right-40 w-[700px] h-[700px] rounded-full opacity-20"
        style={{ background: 'radial-gradient(circle, #4f46e5 0%, #2563eb 40%, transparent 70%)' }} />
      {/* Orb 3 */}
      <div className="orb-3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(circle, #ec4899 0%, #8b5cf6 50%, transparent 70%)' }} />
    </div>
  );
}

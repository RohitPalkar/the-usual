export function Background() {
  return (
    <>
      <div aria-hidden className="hero-bg pointer-events-none fixed inset-0 -z-20 bg-cover bg-center" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(ellipse_at_center,transparent_52%,rgba(0,0,0,0.45)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-black/30 via-transparent to-black/70"
      />
    </>
  );
}
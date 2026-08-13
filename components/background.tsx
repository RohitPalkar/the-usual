export function Background() {
  return (
    <>
      <div aria-hidden className="hero-bg pointer-events-none fixed inset-0 -z-20 bg-cover bg-center" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.25)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-black/10 via-transparent to-black/25"
      />
    </>
  );
}
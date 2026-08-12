export function Background() {
  return (
    <>
      <div aria-hidden className="hero-bg pointer-events-none fixed inset-0 -z-20 bg-cover bg-center" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-20 bg-gradient-to-b from-black/35 via-transparent to-black/80"
      />
    </>
  );
}
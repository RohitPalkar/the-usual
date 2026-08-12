export function Hero() {
  return (
    <section className="flex flex-col items-center px-6 pt-[100px] text-center">
      <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.35em] text-white/60">
        <span className="h-px w-10 bg-white/30" aria-hidden />
        The Usual
        <span className="h-px w-10 bg-white/30" aria-hidden />
      </p>

      <h1
        lang="hi"
        className="mt-6 font-display text-[clamp(3.5rem,13vw,9.5rem)] leading-[1.1] text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.55)]"
      >
        क्या सीन?
      </h1>

      <p className="mt-5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.35em] text-white/70 backdrop-blur">
        Kya Scene
      </p>

      <p className="mt-8 text-[11px] uppercase tracking-[0.3em] text-white/70">
        Good Music. Good Friends. Good Times.
      </p>
    </section>
  );
}
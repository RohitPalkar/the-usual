import { Background } from "@/components/background";
import { Grain } from "@/components/grain";
import { Hero } from "@/components/hero";
import { TopBar } from "@/components/top-bar";
import { Player } from "@/components/player";

export default function Home() {
  return (
    <main className="relative isolate flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      <Background />
      <Grain />
      <Hero />
      <TopBar />
      <Player />
    </main>
  );
}
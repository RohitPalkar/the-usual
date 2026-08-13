import { Background } from "@/components/background";
import { Grain } from "@/components/grain";
import { Experience } from "@/components/experience";

export default function Home() {
  return (
    <main className="relative isolate flex min-h-dvh flex-1 flex-col items-center justify-between overflow-hidden">
      <Background />
      <Grain />
      <Experience />
    </main>
  );
}
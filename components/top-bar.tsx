import { Clock } from "@/components/clock";
import { Listeners } from "@/components/listeners";
import { SocialLinks } from "@/components/social-links";

const CORNER = "max(1rem, env(safe-area-inset-top))";
const SIDE = "max(1rem, env(safe-area-inset-left))";

export function TopBar() {
  return (
    <header
      className="fixed inset-x-0 top-0 z-10"
      style={{
        paddingTop: CORNER,
        paddingLeft: SIDE,
        paddingRight: SIDE,
      }}
    >
      <div className="grid grid-cols-3 items-start">
        <div className="justify-self-start">
          <Clock />
        </div>
        <div className="justify-self-center">
          <Listeners />
        </div>
        <div className="justify-self-end">
          <SocialLinks />
        </div>
      </div>
    </header>
  );
}
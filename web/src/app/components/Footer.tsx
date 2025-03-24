import { Bubble } from "./Bubble";
import { SubFooter } from "./SubFooter";

export function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <SubFooter />
      <Bubble position="-bottom-[520px] -right-[270px] " />

      <div className="relative mx-auto max-w-6xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-white/50 text-sm text-center md:text-left">
            © Stacks Labs 2025
          </p>
        </div>
      </div>
    </footer>
  );
}

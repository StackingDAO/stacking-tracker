import { Info } from "./Info";
import { TelegramBot } from "./TelegramBot";
import { PoolMissing } from "./PoolMissing";
import { usePathname } from "next/navigation";

export function SubFooter() {
  const pathname = usePathname();

  return (
    <section className="mx-auto max-w-6xl px-6 lg:flex lg:justify-between lg:px-8 gap-8">
      {pathname === "/" ? <Info /> : null}
      {pathname === "/pools" ? <PoolMissing /> : null}
      <TelegramBot extraCopy={pathname === "/pools" ? false : true} />
    </section>
  );
}

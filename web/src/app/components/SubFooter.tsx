import { TelegramBot } from "./TelegramBot";
import { PoolMissing } from "./PoolMissing";
import { usePathname } from "next/navigation";
import { StackingDao } from "./StackingDao";

export function SubFooter() {
  const pathname = usePathname();

  return (
    <>
      {pathname === "/pools" && (
        <section className="mx-auto max-w-6xl px-6 lg:flex lg:justify-between lg:px-8 gap-8 pb-6">
          <PoolMissing />
        </section>
      )}
      <section className="mx-auto max-w-6xl px-6 lg:flex lg:justify-between lg:px-8 gap-8">
        <TelegramBot extraCopy={false} />
        <StackingDao />
      </section>
    </>
  );
}

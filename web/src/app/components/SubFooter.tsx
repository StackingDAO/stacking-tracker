import { TelegramBot } from "./TelegramBot";
import { PoolMissing } from "./PoolMissing";
import { usePathname } from "next/navigation";

export function SubFooter() {
  const pathname = usePathname();

  return (
    <>
      {pathname !== "/" ? (
        <>
          <section className="mx-auto max-w-6xl px-6 lg:flex lg:justify-between lg:px-8 gap-8">
            {pathname === "/pools" && <PoolMissing />}
            <TelegramBot extraCopy={pathname === "/pools" ? false : true} />
          </section>
        </>
      ) : null}
    </>
  );
}

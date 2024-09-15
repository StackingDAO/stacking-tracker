export function TelegramBot() {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 flex flex-col gap-2 max-w-5xl w-full">
      <div className="font-semibold text-xl">Try out our Telegram bot!</div>
      <div className="text-sm">
        Quickly follow up on your PoX positions (stacking pools, liquid stacking
        protocols, liquid stacking DeFi, solo stacking).
      </div>
      <div>No matter how you are stacking, we got you covered.</div>
      <a
        className="text-blue-600 font-semibold hover:underline"
        href="https://t.me/stackingtracker_bot/"
      >
        @stackingtracker_bot
      </a>
    </div>
  );
}

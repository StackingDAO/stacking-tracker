type Props = {
  position?: string;
};

export function Bubble({ position }: Props) {
  return (
    <div
      className={`absolute w-[740px] h-[740px] rounded-full bg-orange/10 blur-[300px] ${position}`}
    />
  );
}

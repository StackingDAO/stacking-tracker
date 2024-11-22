type Props = {
  label: string;
  link: string;
  target?: string;
};

export function ButtonLink({ label, link, target }: Props) {
  return (
    <a
      className="block text-center md:text-left md:inline-block text-sm font-semibold text-orange px-4 py-2.5 rounded-lg bg-orange/10 hover:text-black hover:bg-orange focus:bg-orange/70"
      href={link}
      target={target || ""}
    >
      {label}
    </a>
  );
}

import Logo from "../Logo";

interface HeaderProps {
  headline: string;
  tagline: string;
}

export function Header({ headline, tagline }: HeaderProps) {
  return (
    <>
      <Logo />
      <div className="flex flex-col items-center gap-2 mb-6">
        <h1 className="text-neutral-950 text-preset-1">{headline}</h1>
        <p className="text-neutral-600 text-preset-5">{tagline}</p>
      </div>
    </>
  );
}

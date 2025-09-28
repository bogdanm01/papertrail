interface HeaderProps {
  headline: string;
  tagline: string;
}

export function AuthHeader({ headline, tagline }: HeaderProps) {
  return (
    <>
      <div className="flex flex-col gap-1.5 mb-6">
        <h1 className="text-neutral-950 text-preset-1">{headline}</h1>
        <p className="text-neutral-600 text-preset-5">{tagline}</p>
      </div>
    </>
  );
}

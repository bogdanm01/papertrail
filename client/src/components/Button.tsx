import { cva } from "class-variance-authority";

interface ButtonProps {
  handleClick: () => void;
  children: React.ReactNode;
  variant?: "solid" | "outline";
  radius?: "lg" | "xl";
  fontWeight?: "regular" | "medium";
  color?: string;
  textColor?: string;
}

const buttonCva = cva(
  "flex items-center justify-center gap-2 px-4 py-2.5 cursor-pointer hover:opacity-90 transition delay-50 ease-in",
  {
    variants: {
      variant: {
        solid: "bg-blue-500 text-neutral-0",
        outline: "bg-transparent border border-neutral-300 text-neutral-950",
      },
      radius: {
        lg: "rounded-lg",
        xl: "rounded-xl",
      },
      fontWeight: {
        regular: "font-regular",
        medium: "font-medium",
      },
    },
    defaultVariants: {
      variant: "solid",
      radius: "lg",
      fontWeight: "regular",
    },
  }
);

function Button({
  handleClick,
  children,
  variant,
  radius,
  fontWeight,
  color,
  textColor,
}: ButtonProps) {
  return (
    <button
      onClick={handleClick}
      className={`${buttonCva({ variant, radius, fontWeight })} ${color ?? ""} ${textColor ?? ""}`}
    >
      {children}
    </button>
  );
}

export default Button;

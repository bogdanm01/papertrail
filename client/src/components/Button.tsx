// TODO: Add variant and color prop

interface ButtonProps {
  handleClick: () => void;
  children: React.ReactNode;
}

function Button({ handleClick, children }: ButtonProps) {
  return (
    <button
      onClick={handleClick}
      className="flex items-center justify-center gap-2 bg-blue-500 text-neutral-0 rounded-lg px-4 py-2.5 cursor-pointer"
    >
      {children}
    </button>
  );
}

export default Button;

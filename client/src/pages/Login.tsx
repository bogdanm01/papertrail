import Button from "../components/Button";
import { EyeIcon } from "../components/icons/EyeIcon";
import Logo from "../components/Logo";

import googleIcon from "/icon-google.svg";

function Login() {
  return (
    <div className="bg-neutral-100 h-screen flex items-center justify-center">
      <div className="bg-neutral-0 p-12 rounded-xl flex flex-col gap-4 w-[540px] large-shadow border border-neutral-200">
        <Header />

        <CustomInput
          id="email"
          placeholder="Email address"
          label="Email Address"
          type="email"
        />

        <CustomInput
          id="password"
          placeholder="Password"
          label="Password"
          type="password"
          icon={
            <button
              className="absolute top-0 bottom-0 right-4 my-auto mx-0 cursor-pointer h-fit"
              aria-label="Show password"
            >
              <EyeIcon className="fill-neutral-500" />
            </button>
          }
        />

        <Button handleClick={() => {}}>Login</Button>

        <div className="border-t border-neutral-200 flex flex-col text-center pt-6 gap-4">
          <p className="text-preset-5 text-neutral-600">Or log in with:</p>

          <Button
            handleClick={() => {}}
            variant="outline"
            radius="xl"
            fontWeight="medium"
          >
            <img src={googleIcon} alt="google icon" />
            Google
          </Button>
        </div>

        <hr className="text-neutral-200" />

        <footer className="text-center">
          <p className="text-preset-5 text-neutral-600">
            No account yet?{" "}
            <span
              className="text-neutral-950 cursor-pointer"
              role="button"
              tabIndex={0}
            >
              Sign Up
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export function CustomInput({ id, label, type, placeholder, icon }: any) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-preset-4 text-neutral-950">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          className="px-4 py-2.5 pr-10 placeholder:text-preset-5 border-neutral-300 border rounded-lg text-neutral-950 w-full"
          placeholder={placeholder}
        />
        {icon}
      </div>
    </div>
  );
}

export function Header() {
  return (
    <>
      <Logo />
      <div className="flex flex-col items-center gap-2 mb-6">
        <h1 className="text-neutral-950 text-preset-1">Welcome to Note</h1>
        <p className="text-neutral-600 text-preset-5">
          Please log in to continue
        </p>
      </div>
    </>
  );
}

export default Login;

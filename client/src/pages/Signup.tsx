import Button from "../components/Button";
import { EyeIcon } from "../components/icons/EyeIcon";
import { Header } from "../components/loginPage/Header";


import googleIcon from "/icon-google.svg";

function SignupPage() {
  return (
    <div className="bg-neutral-100 h-screen flex items-center justify-center">
      <div className="bg-neutral-0 p-12 rounded-xl flex flex-col gap-4 w-[540px] large-shadow border border-neutral-200">
        <Header
          headline="Create Your Account"
          tagline="Sign up to start organizing your notes and boost your productivity."
        ></Header>
{/* 
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
        /> */}
        <Button handleClick={() => {}}>Sign up</Button>

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

        <footer className="text-center">
          <p className="text-preset-5 text-neutral-600">
            Already have an account?{" "}
            <span
              className="text-neutral-950 cursor-pointer"
              role="button"
              tabIndex={0}
            >
              Login
            </span>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default SignupPage;

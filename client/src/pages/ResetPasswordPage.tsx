import Button from "../components/Button";
import { EyeIcon } from "../components/icons/EyeIcon";
import { Header } from "../components/loginPage/Header";
import { CustomInput } from "./Login";

import googleIcon from "/icon-google.svg";

function ResetPasswordPage() {
  return (
    <div className="bg-neutral-100 h-screen flex items-center justify-center">
      <div className="bg-neutral-0 p-12 rounded-xl flex flex-col gap-4 w-[540px] large-shadow border border-neutral-200">
        <Header
          headline="Reset Your Password"
          tagline="Choose a new password to secure your account."
        ></Header>

        <CustomInput
          id="newPassword"
          label="New Password"
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
        <CustomInput
          id="password"
          label="Confirm New Password"
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
        <Button handleClick={() => {}}>Reset Password</Button>
      </div>
    </div>
  );
}

export default ResetPasswordPage;

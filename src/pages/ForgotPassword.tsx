import { useState } from "react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { isValidEmail } from "@/functions/regexFunctions";
import { ErrorStatement, Input, PrimaryButton } from "@/components";
import { Link, useNavigate } from "react-router-dom";
import { useDBUser } from "@/context/UserContext";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState({
    email: 0,
  });

  const navigate = useNavigate();
  const { dbUser } = useDBUser();

  if (dbUser) {
    navigate("/");
  }

  const handleSubmit = async () => {
    if (email == null || email == undefined || email.length == 0) {
      setError((prev) => ({ ...prev, email: 1 }));
      return;
    } else if (!isValidEmail(email)) {
      setError((prev) => ({ ...prev, email: 2 }));
      return;
    }

    const auth = getAuth();
    setMessage("");
    setError({ email: 0 });
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your email for a password reset link.");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error(err);
      console.log(err.message);
    }
  };

  return (
    <div>
      <h2></h2>

      <div className="bg-white mt-14 mx-auto dark:border-1 dark:border-white/25 dark:bg-secondarydarkbg max-w-xl dark:bg-darkgrey dark:text-darkmodetext border-darkbg/25 border-1 px-8 lg:max-w-lg  p-5 md:px-10 shadow-lg rounded-2xl pb-10">
        {/* Title */}
        <h1 className="dark:text-darkmodetext pt-5 font-bold text-2xl text-center">
          Forgot Password
        </h1>

        {/* Subtitle */}
        <h2 className="dark:text-darkmodetext mt-1 text-sm text-darkbg/70 text-center">
          Forgot your password? Enter your email to reset it.
        </h2>

        {/* Sign up with Email form */}
        <>
          {/* Email Input field */}
          <div className="mt-4 px-2">
            <p className="font-medium">Email</p>
            <Input
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);

                // Reset error if value is correct
                if (
                  e.target.value != null &&
                  e.target.value != undefined &&
                  e.target.value.length != 0 &&
                  isValidEmail(e.target.value)
                ) {
                  setError((prev) => ({ ...prev, email: 0 }));
                }
              }}
              onBlur={() => {
                if (email == null || email == undefined || email.length == 0) {
                  setError((prev) => ({ ...prev, email: 1 }));
                  return;
                } else if (!isValidEmail(email)) {
                  setError((prev) => ({ ...prev, email: 2 }));
                  return;
                } else {
                  setError((prev) => ({ ...prev, email: 0 }));
                }
              }}
              placeholder={"Enter your email address"}
              className="focus:border-darkbg dark:focus:border-white transition-all"
            />

            <ErrorStatement
              isOpen={error.email == 1}
              text={"Please enter your email."}
            />

            <ErrorStatement
              isOpen={error.email == 2}
              text={"Please enter a valid email address."}
            />
          </div>

          {!error.email && message && (
            <p className="text-green-600 ml-3 dark:text-green-400">{message}</p>
          )}

          {/* Submit Button */}
          <div className="mt-8">
            <PrimaryButton
              disabledText="Please Wait..."
              onClick={handleSubmit}
              text={"Send Reset link!"}
              className="w-full text-sm dark:hover:!bg-cta dark:hover:!border-cta bg-darkbg border-darkbg hover:!bg-darkbg/85 hover:!border-darkbg/85 hover:!scale-100 rounded-xl"
            />
          </div>
        </>

        {/* Horizontal line */}
        <div className="flex mt-10 mb-5 items-center">
          <div className="flex-1 h-0 border-1 border-darkbg/25 dark:border-white/25"></div>
        </div>

        {/* Link to Login */}
        <div className="text-center text-darkbg/80 dark:text-white/80 pt-2">
          Remembered your password?{" "}
          <Link
            className="text-blue-600 dark:text-blue-400 font-medium"
            to="/signin"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

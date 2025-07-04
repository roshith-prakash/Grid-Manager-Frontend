import { useState, useEffect } from "react";
import { getAuth, confirmPasswordReset } from "firebase/auth";
import { ErrorStatement, PasswordInput, PrimaryButton } from "@/components";
import { isValidPassword } from "@/functions/regexFunctions";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    pw: 0,
    confirmpw: 0,
  });
  const [oobCode, setOobCode] = useState("");
  const [disabled, setDisabled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("oobCode");
    if (code) {
      setOobCode(code);
    } else {
      console.log("Missing password reset code.");
    }
  }, []);

  const handleSubmit = async () => {
    if (password == null || password == undefined || password.length == 0) {
      setError((prev) => ({ ...prev, pw: 1 }));
      return;
    } else if (!isValidPassword(password)) {
      setError((prev) => ({ ...prev, pw: 2 }));
      return;
    }

    if (
      confirmPassword == null ||
      confirmPassword == undefined ||
      confirmPassword.length == 0
    ) {
      setError((prev) => ({ ...prev, confirmpw: 1 }));
      return;
    } else if (password != confirmPassword) {
      setError((prev) => ({ ...prev, confirmpw: 2 }));
      return;
    }

    setError({
      pw: 0,
      confirmpw: 0,
    });

    setDisabled(true);
    const auth = getAuth();

    try {
      await confirmPasswordReset(auth, oobCode, password);
      toast.success("Password has been reset! You can now log in.");
      setDisabled(false);
      navigate("/signin");
    } catch (err) {
      console.error(err);
      setDisabled(false);
      toast.error("Failed to reset password. Link may be invalid or expired.");
    }
  };

  return (
    <div>
      <div className="bg-white mx-auto mt-14 dark:border-1 dark:border-white/25 dark:bg-secondarydarkbg max-w-xl dark:bg-darkgrey dark:text-darkmodetext border-darkbg/25 border-1 px-8 lg:max-w-lg p-5 md:px-10 shadow-lg rounded-2xl pb-10">
        {/* Title */}
        <h1 className="dark:text-darkmodetext pt-5 font-bold text-2xl text-center">
          Reset your password
        </h1>

        {/* Subtitle */}
        <h2 className="dark:text-darkmodetext mt-1 text-sm text-darkbg/70 text-center">
          Enter your new password below.
        </h2>

        {/* Password Reset Form */}
        <>
          {/* Password Input field */}
          <div className="mt-4 px-2">
            <p className="font-medium">New Password</p>
            <PasswordInput
              value={password}
              className="focus:border-darkbg dark:focus:border-white transition-all"
              onChange={(e) => {
                setPassword(e.target.value);

                // Reset error if value is correct
                if (
                  e.target.value != null &&
                  e.target.value != undefined &&
                  e.target.value.length != 0 &&
                  isValidPassword(e.target.value)
                ) {
                  setError((prev) => ({ ...prev, pw: 0 }));
                }
              }}
              onBlur={() => {
                if (
                  password == null ||
                  password == undefined ||
                  password.length == 0
                ) {
                  setError((prev) => ({ ...prev, pw: 1 }));
                  return;
                } else if (!isValidPassword(password)) {
                  setError((prev) => ({ ...prev, pw: 2 }));
                  return;
                } else {
                  setError((prev) => ({ ...prev, pw: 0 }));
                }
              }}
              placeholder={"Enter your password"}
            />

            <ErrorStatement
              isOpen={error.pw == 1}
              text={"Please enter a password."}
            />

            <ErrorStatement
              isOpen={error.pw == 2}
              text={
                "Password must be 8 characters long and must contain an uppercase letter, lowercase letter, number and special character."
              }
            />
          </div>

          {/* Confirm Password Input field */}
          <div className="mt-4 px-2">
            <p className="font-medium">Confirm Password</p>
            <PasswordInput
              value={confirmPassword}
              className="focus:border-darkbg dark:focus:border-white transition-all"
              onChange={(e) => {
                setConfirmPassword(e.target.value);

                // Reset error if value is correct
                if (
                  e.target.value != null &&
                  e.target.value != undefined &&
                  e.target.value.length != 0 &&
                  isValidPassword(e.target.value) &&
                  e.target.value == password
                ) {
                  setError((prev) => ({ ...prev, confirmpw: 0 }));
                }
              }}
              onBlur={() => {
                if (
                  confirmPassword == null ||
                  confirmPassword == undefined ||
                  confirmPassword.length == 0
                ) {
                  setError((prev) => ({ ...prev, confirmpw: 1 }));
                  return;
                } else if (password != confirmPassword) {
                  setError((prev) => ({ ...prev, confirmpw: 2 }));
                  return;
                } else {
                  setError((prev) => ({ ...prev, confirmpw: 0 }));
                }
              }}
              placeholder={"Confirm your password"}
            />

            <ErrorStatement
              isOpen={error.confirmpw == 1}
              text={"Please re-enter your password."}
            />

            <ErrorStatement
              isOpen={error.confirmpw == 2}
              text={"Passwords do not match."}
            />
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <PrimaryButton
              disabled={disabled}
              disabledText="Please Wait..."
              onClick={handleSubmit}
              text={"Reset Password"}
              className="w-full text-sm dark:hover:!bg-cta dark:hover:!border-cta bg-darkbg border-darkbg hover:!bg-darkbg/85 hover:!border-darkbg/85 hover:!scale-100 rounded-xl"
            />
          </div>
        </>
      </div>
    </div>
  );
}

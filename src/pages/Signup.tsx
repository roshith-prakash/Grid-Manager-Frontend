import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ErrorStatement,
  Input,
  PasswordInput,
  PrimaryButton,
} from "@/components";

// Auth Imports
import { auth } from "@/firebase/firebase";
import {
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import { axiosInstance } from "@/utils/axiosInstance";
import { isValidEmail, isValidPassword } from "../functions/regexFunctions";
import { FaGoogle } from "react-icons/fa6";
import { useDBUser } from "@/context/UserContext";

const provider = new GoogleAuthProvider();

const Signup = () => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState({
    email: 0,
    pw: 0,
    confirmpw: 0,
  });

  const { dbUser } = useDBUser();

  if (dbUser) {
    navigate("/");
  }

  // Scroll to top of page.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set window title.
  useEffect(() => {
    document.title = "Sign up | Grid Manager";
  }, []);

  // Handle Email Sign up
  const handleEmailSignup = () => {
    setError({
      email: 0,
      pw: 0,
      confirmpw: 0,
    });

    // Validation Checks
    if (email == null || email == undefined || email.length == 0) {
      setError((prev) => ({ ...prev, email: 1 }));
      return;
    } else if (!isValidEmail(email)) {
      setError((prev) => ({ ...prev, email: 2 }));
      return;
    } else if (
      password == null ||
      password == undefined ||
      password.length == 0
    ) {
      setError((prev) => ({ ...prev, pw: 1 }));
      return;
    } else if (!isValidPassword(password)) {
      setError((prev) => ({ ...prev, pw: 2 }));
      return;
    } else if (
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

    // Disable button
    setDisabled(true);

    // Create user using firebase auth.
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        // Send verification email
        sendEmailVerification(user).then(() => {
          toast("Email Verification Link sent.");
          // Enable button
          setDisabled(false);
        });

        navigate("/onboarding");
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // Enable button
        setDisabled(false);
        if (String(errorMessage).includes("(auth/email-already-in-use)")) {
          // Display error
          toast.error("Email is already registered!");
        } else {
          // Display error
          toast.error("Something went wrong!");
        }
      });
  };

  // Handle Google Sign up
  const handleGoogleSignup = () => {
    setDisabled(true);
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;

        // Check if user exists in DB - if yes, send to home - if no, send to onboarding.
        axiosInstance
          .post("/user/get-current-user", { user: user })
          .then((res) => {
            if (res?.data?.user) {
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err?.response?.data);
            if (err?.response?.data?.data == "User does not exist.") {
              navigate("/onboarding");
            }
          });
      })
      .catch(() => {
        setDisabled(false);
        // Handle Errors here.
        // const errorCode = error.code;/
        // const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        toast.error("Something went wrong!");
      });
  };

  return (
    <>
      <div className="lg:min-h-[89vh] flex w-full">
        {/* Left Div */}
        <div className="min-h-[95vh] lg:h-full lg:min-h-[88vh] pb-10 bg-cover flex-1 flex justify-center items-center">
          {/* Sign up Form Div */}
          <div className="bg-white dark:border-1 dark:border-white/25 dark:bg-secondarydarkbg max-w-xl dark:bg-darkgrey dark:text-darkmodetext border-darkbg/25 border-1 px-8 lg:max-w-lg mt-5 p-5 md:px-10 shadow-lg rounded-2xl pb-10">
            {/* Title */}
            <h1 className="dark:text-darkmodetext pt-5 font-bold text-2xl text-center">
              Create your account
            </h1>

            {/* Subtitle */}
            <h2 className="dark:text-darkmodetext mt-1 text-sm text-darkbg/70 text-center">
              Welcome! Please fill in the details to get started.
            </h2>

            {/* Google Sign up Button */}
            <div className="flex justify-center">
              <button
                disabled={disabled}
                onClick={handleGoogleSignup}
                className="mt-8 dark:hover:border-white cursor-pointer hover:border-darkbg border-darkbg/25 dark:border-white/25 border-1 flex  gap-x-2 py-2 justify-center items-center px-14 shadow rounded-lg font-medium active:shadow transition-all"
              >
                {disabled ? <p>Please Wait...</p> : <p>Sign up with Google</p>}
                <FaGoogle className="text-xl translate-y-0.5" />
              </button>
            </div>

            {/* OR */}
            <div className="flex mt-10 mb-5 items-center">
              <div className="flex-1 h-0 border-1 border-darkbg/25 dark:border-white/25"></div>
              <p className="text-center px-2 font-semibold text-darkbg/50 dark:text-white/25">
                OR
              </p>
              <div className="flex-1 h-0 border-1 border-darkbg/25 dark:border-white/25"></div>
            </div>

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
                    if (
                      email == null ||
                      email == undefined ||
                      email.length == 0
                    ) {
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

              {/* Password Input field */}
              <div className="mt-4 px-2">
                <p className="font-medium">Password</p>
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
                  onClick={handleEmailSignup}
                  text={"Sign up"}
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
              Already have an account?{" "}
              <Link
                className="text-blue-600 dark:text-blue-400 font-medium"
                to="/signin"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>

        {/* Image Div - displayed only on laptop */}
        <div className="hidden lg:flex lg:flex-1  items-center justify-center">
          <img
            src={
              "https://res.cloudinary.com/do8rpl9l4/image/upload/v1741164523/racecar_guyfno.svg"
            }
            className="max-w-[90%]"
          />
        </div>
      </div>
    </>
  );
};

export default Signup;

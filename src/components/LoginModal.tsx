import Modal from "./reuseit/Modal";
import PrimaryButton from "./reuseit/PrimaryButton";
import ErrorStatement from "./ErrorStatement";
import { useNavigate } from "react-router-dom";
import PasswordInput from "./reuseit/PasswordInput";
import { FaGoogle } from "react-icons/fa6";
import toast from "react-hot-toast";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { isValidEmail, isValidPassword } from "@/functions/regexFunctions";
import { auth } from "@/firebase/firebase";
import Input from "./reuseit/Input";

const provider = new GoogleAuthProvider();

const LoginModal = ({
  isModalOpen,
  setIsModalOpen,
  moveToSignup,
}: {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  moveToSignup: () => void;
}) => {
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({
    email: 0,
    pw: 0,
  });

  // Login using email and password
  const handleLogin = () => {
    setError({
      email: 0,
      pw: 0,
    });

    // Check if email has been entered
    if (email == null || email == undefined || email.length == 0) {
      setError((prev) => ({ ...prev, email: 1 }));
      return;
    }
    // Check if email is a valid email
    else if (!isValidEmail(email)) {
      setError((prev) => ({ ...prev, email: 2 }));
      return;
    }
    // Check if password has been entered
    else if (
      password == null ||
      password == undefined ||
      password.length == 0
    ) {
      setError((prev) => ({ ...prev, pw: 1 }));
      return;
    }
    // Check if password is a valid password
    else if (!isValidPassword(password)) {
      setError((prev) => ({ ...prev, pw: 2 }));
      return;
    }

    // Disable buttons
    setDisabled(true);

    // Sign in using firebase
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;

        // Check if user exists in DB - if yes, send to home - if no, send to onboarding.
        axiosInstance
          .post("/user/get-current-user", { user: user })
          .then((res) => {
            if (res?.data?.user) {
              setDisabled(false);
              setIsModalOpen();
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err);
            setDisabled(false);
            if (err?.response?.data?.data == "User does not exist.") {
              setIsModalOpen();
              navigate("/onboarding");
            }
          });
        // ...
      })
      .catch((error) => {
        // const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        setDisabled(false);
        // Display invalid credentials toast error
        if (String(errorMessage).includes("(auth/invalid-credential)")) {
          toast.error("Invalid Credentials.");
        }
        // Display error
        else {
          toast.error("Something went wrong.");
        }
      });
  };

  // Login using google
  const handleGoogleLogin = () => {
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
              setDisabled(false);
              setIsModalOpen();
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err);
            setDisabled(false);
            if (err?.response?.data?.data == "User does not exist.") {
              setIsModalOpen();
              navigate("/onboarding");
            }
          });
      })
      .catch((error) => {
        // Handle Errors here.
        setDisabled(false);
        // const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        // const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorMessage);
      });
  };

  return (
    <Modal
      className="w-lg noscroller"
      isOpen={isModalOpen}
      onClose={setIsModalOpen}
    >
      {/* Title */}
      <h1 className="dark:text-darkmodetext pt-5 font-bold text-xl text-center">
        Sign in to Grid Manager
      </h1>

      {/* Subtitle */}
      <h2 className="dark:text-darkmodetext mt-1 text-sm text-darkbg/70 text-center">
        Welcome back! Please sign in to continue.
      </h2>

      {/* Google Sign up Button */}
      <div className="flex justify-center">
        <button
          disabled={disabled}
          onClick={handleGoogleLogin}
          className="mt-8 text-sm dark:hover:border-white cursor-pointer hover:border-darkbg border-darkbg/25 dark:border-white/25 border-1 flex  gap-x-2 py-2 justify-center items-center px-14 shadow rounded-lg font-medium active:shadow transition-all"
        >
          {disabled ? <p>Please Wait...</p> : <p>Sign in with Google</p>}

          <FaGoogle className="text-md translate-y-0.5" />
        </button>
      </div>

      {/* OR */}
      <div className="flex mt-8 mb-5 text-sm items-center">
        <div className="flex-1 h-0 border-1 border-darkbg/25 dark:border-white/25"></div>
        <p className="text-center px-2 font-semibold text-darkbg/50 dark:text-white/25">
          OR
        </p>
        <div className="flex-1 h-0 border-1 border-darkbg/25 dark:border-white/25"></div>
      </div>

      {/* Email Login */}
      <>
        {/* Email Input field */}
        <div className="mt-4 px-2">
          <p className="text-sm font-medium">Email</p>
          <Input
            value={email}
            className="text-sm focus:border-darkbg dark:focus:border-white transition-all"
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
        <div className="text-sm mt-4 px-2">
          <p className="text-sm font-medium">Password</p>
          <PasswordInput
            value={password}
            className="text-sm focus:border-darkbg dark:focus:border-white transition-all"
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

        <button
          className="ml-4 text-sm text-blue-600 dark:text-blue-400 font-medium cursor-pointer"
          onClick={() => {
            setIsModalOpen();
            navigate("/forgot-password");
          }}
        >
          Forgot your password?
        </button>

        {/* Submit Button */}
        <div className="text-sm mt-6">
          <PrimaryButton
            disabled={disabled}
            disabledText="Please Wait..."
            onClick={handleLogin}
            text={"Sign in"}
            className="w-full text-sm dark:hover:!bg-cta dark:hover:!border-cta bg-darkbg border-darkbg hover:!bg-darkbg/85 hover:!border-darkbg/85 hover:!scale-100 rounded-xl"
          />
        </div>
      </>

      {/* Horizontal line */}
      <div className="flex mt-6 mb-5 items-center">
        <div className="flex-1 h-0 border-1 border-darkbg/25 dark:border-white/25"></div>
      </div>

      {/* Link to Sign up */}
      <div className="text-sm text-center text-darkbg/80 dark:text-white/80 pt-2">
        Don't have an account?{" "}
        <button
          className="cursor-pointer text-blue-600 dark:text-blue-400 font-medium"
          onClick={moveToSignup}
        >
          Sign up
        </button>
      </div>
    </Modal>
  );
};

export default LoginModal;

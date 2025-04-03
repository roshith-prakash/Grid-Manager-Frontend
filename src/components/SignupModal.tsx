import Modal from "./reuseit/Modal";
import PrimaryButton from "./reuseit/PrimaryButton";
import ErrorStatement from "./ErrorStatement";
import { useNavigate } from "react-router-dom";
import PasswordInput from "./reuseit/PasswordInput";
import { FaGoogle } from "react-icons/fa6";
import toast from "react-hot-toast";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { useState } from "react";
import { isValidEmail, isValidPassword } from "@/functions/regexFunctions";
import { auth } from "@/firebase/firebase";
import Input from "./reuseit/Input";

const provider = new GoogleAuthProvider();

const SignupModal = ({
  isModalOpen,
  setIsModalOpen,
  moveToLogin,
}: {
  isModalOpen: boolean;
  setIsModalOpen: () => void;
  moveToLogin: () => void;
}) => {
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

        setIsModalOpen();
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
              setIsModalOpen();
              navigate("/");
            }
          })
          .catch((err) => {
            console.log(err?.response?.data);
            if (err?.response?.data?.data == "User does not exist.") {
              setIsModalOpen();
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
    <Modal
      className="w-lg noscroller"
      isOpen={isModalOpen}
      onClose={setIsModalOpen}
    >
      {/* Title */}
      <h1 className="dark:text-darkmodetext font-bold text-xl text-center">
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
          className="mt-8 text-sm dark:hover:border-white cursor-pointer hover:border-darkbg border-darkbg/25 dark:border-white/25 border-1 flex  gap-x-2 py-2 justify-center items-center px-14 shadow rounded-lg font-medium active:shadow transition-all"
        >
          {disabled ? <p>Please Wait...</p> : <p>Sign up with Google</p>}
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

      {/* Sign up with Email form */}
      <>
        {/* Email Input field */}
        <div className="mt-4 px-2">
          <p className="font-medium text-sm">Email</p>
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
            className="focus:border-darkbg text-sm dark:focus:border-white transition-all"
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
          <p className="font-medium text-sm">Password</p>
          <PasswordInput
            value={password}
            className="focus:border-darkbg text-sm dark:focus:border-white transition-all"
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
          <p className="font-medium text-sm">Confirm Password</p>
          <PasswordInput
            value={confirmPassword}
            className="focus:border-darkbg text-sm dark:focus:border-white transition-all"
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
        <div className="mt-6">
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
      <div className="flex mt-5 mb-5 items-center">
        <div className="flex-1 h-0 border-1 border-darkbg/25 dark:border-white/25"></div>
      </div>

      {/* Login */}
      <div className=" text-center text-sm text-darkbg/80 dark:text-white/80 pt-2">
        Already have an account?{" "}
        <button
          className="cursor-pointer text-blue-600 dark:text-blue-400 font-medium"
          onClick={moveToLogin}
        >
          Sign in
        </button>
      </div>
    </Modal>
  );
};

export default SignupModal;

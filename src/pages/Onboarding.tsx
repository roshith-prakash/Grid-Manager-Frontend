import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useDBUser } from "@/context/UserContext";
import {
  PrimaryButton,
  ErrorStatement,
  Input,
  SecondaryButton,
} from "@/components";
import { useNavigate } from "react-router-dom";
import { sendEmailVerification, User } from "firebase/auth";
import { toast } from "react-hot-toast";
import { auth } from "../firebase/firebase";
import { IoCloudUploadOutline } from "react-icons/io5";
import { axiosInstance } from "@/utils/axiosInstance";
import { isValidUsername } from "../functions/regexFunctions";
import { MdOutlineAccountCircle } from "react-icons/md";

const Onboarding = () => {
  // Navigate function to navigate to different pages.
  const navigate = useNavigate();
  // Db user object
  const { dbUser, fetchUser } = useDBUser();
  // Firebase user object
  const { currentUser } = useAuth();
  // Ref for file input
  const fileRef = useRef<HTMLInputElement | null>(null);
  // Name of the user to be stored in DB
  const [name, setName] = useState("");
  // Profile image of user
  const [image, setImage] = useState<File | string>("");
  // Username to be stored in DB
  const [username, setUsername] = useState("");
  // To disable button
  const [disabled, setDisabled] = useState(false);
  // Error
  const [error, setError] = useState({
    name: 0,
    username: 0,
  });

  // Scroll to the top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set window title.
  useEffect(() => {
    document.title = "Onboarding | Grid Manager";
  }, []);

  // To set default values.
  useEffect(() => {
    if (currentUser) {
      setName(currentUser?.displayName ? currentUser?.displayName : "");
      setImage(currentUser?.photoURL ? currentUser?.photoURL : "");
    }
  }, [currentUser]);

  // Set the received image in the state.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleFileChange = (e: any) => {
    if (fileRef?.current) {
      setImage(e.target.files[0]);
      // @ts-expect-error Null must be set so that the fileRef is usable again
      fileRef.current.value = null;
    }
  };

  // To resend email verification link.
  const sendVerification = () => {
    const user = auth.currentUser;
    sendEmailVerification(user as User)
      .then(() => {
        toast("Email Verification Link sent.");
      })
      .catch(() => {
        toast.error("Something went wrong.");
      });
  };

  // Submit the data to the server to create the user object.
  const handleSubmit = () => {
    setError({
      name: 0,
      username: 0,
    });

    if (name == null || name == undefined || name.length <= 0) {
      setError((prev) => ({ ...prev, name: 1 }));
      return;
    } else if (name.length > 30) {
      setError((prev) => ({ ...prev, name: 2 }));
      return;
    } else if (
      username == null ||
      username == undefined ||
      username.length <= 0
    ) {
      setError((prev) => ({ ...prev, username: 1 }));
      return;
    } else if (username.length > 20) {
      setError((prev) => ({ ...prev, username: 3 }));
      return;
    } else if (!isValidUsername(username)) {
      setError((prev) => ({ ...prev, username: 4 }));
      return;
    }

    setDisabled(true);

    // Check if username is already in use.
    axiosInstance
      .post("/user/check-username", { username: username?.toLowerCase() })
      .then((res) => {
        // If username already exists - show an error
        if (res.data?.exists) {
          setDisabled(false);
          setError((prev) => ({ ...prev, username: 2 }));
          return;
        }
        // If username is available
        else {
          // Create formdata instance
          const formData = new FormData();

          // If image is added - add a file
          if (typeof image != "string") {
            formData.append("file", image);
          }

          // Add details in the user object
          const obj = {
            ...currentUser,
            username: username?.toLowerCase(),
            name: name,
            image: typeof image == "string" ? image : null,
          };

          // Append the new user object in formdata
          formData.append("user", JSON.stringify(obj));

          // Add user in DB
          axiosInstance
            .post("/user/create-user", formData, {
              headers: { "Content-Type": "multipart/form-data" },
            })
            .then(() => {
              setDisabled(false);
              fetchUser();
              navigate("/");
            })
            .catch(() => {
              // Display error
              toast.error("Something went wrong!");
              // Enable button
              setDisabled(false);
            });
        }
      })
      .catch((err) => {
        setDisabled(false);
        toast.error("Something went wrong.");
        console.log(err);
        return;
      });
  };

  // If user hasn't signed in using firebase
  if (!currentUser) {
    return (
      <div>
        <div className="min-h-[70vh] md:min-h-[65vh] dark:bg-darkbg dark:text-darkmodetext lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
          <div>
            {/* Title for page */}
            <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
              You have not signed in!
            </p>
            <div className="mt-10 flex flex-col gap-10 justify-center items-center">
              {/* Image */}
              <img
                src={
                  "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736738810/notfound_eqfykw.svg"
                }
                className="max-w-[50%] lg:max-w-[40%] pointer-events-none"
              />
              {/* Button to navigate back to home page */}
              <div>
                <SecondaryButton
                  onClick={() => navigate("/signup")}
                  text="Sign up"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user has signed up via email but has not verified their email.
  if (!currentUser?.emailVerified) {
    return (
      <div>
        <div className="min-h-[70vh] md:min-h-[65vh] dark:bg-darkbg dark:text-darkmodetext lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
          <div>
            {/* Title for page */}
            <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
              Verify Email by clicking link in your mailbox!
            </p>
            <div className="mt-10 flex flex-col gap-10 justify-center items-center">
              {/* Image */}
              <img
                src={
                  "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736738810/notfound_eqfykw.svg"
                }
                className="max-w-[50%] lg:max-w-[40%] pointer-events-none"
              />
              {/* Button to navigate back to home page */}
              <div>
                <SecondaryButton
                  onClick={sendVerification}
                  text="Resend Verification Link"
                />
              </div>
              <div>
                <SecondaryButton
                  className="w-full"
                  onClick={() => window.location.reload()}
                  text={
                    <div className="flex flex-col px-8">
                      <p>Already verified?</p>
                      <p>Reload the page</p>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user already exists
  if (dbUser) {
    return (
      <div>
        <div className="min-h-[70vh] dark:bg-darkbg dark:text-darkmodetext md:min-h-[65vh] lg:min-h-[60vh] flex items-center justify-center pt-12 pb-32">
          <div>
            {/* Title for page */}
            <p className="text-3xl lg:text-4xl px-5 text-center mt-14">
              You have already created your profile!
            </p>
            <div className="mt-10 flex flex-col gap-10 justify-center items-center">
              {/* Image */}
              <img
                src={
                  "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736738810/notfound_eqfykw.svg"
                }
                className="max-w-[50%] lg:max-w-[40%] pointer-events-none"
              />
              {/* Button to navigate back to home page */}
              <div>
                <SecondaryButton
                  onClick={() => navigate("/")}
                  text="Go Back Home"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If onboarding process was left.
  return (
    <div>
      <div className=" min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] flex items-center justify-center pt-12 pb-20">
        <div className="bg-white dark:bg-secondarydarkbg w-full dark:bg-darkgrey dark:text-darkmodetext border-[1px] max-w-[95%] md:max-w-3xl md:mt-5 lg:mt-5 p-5 md:px-20 shadow-xl rounded-xl pb-10">
          {/* Title */}
          <h1 className="dark:text-darkmodetext pt-5 font-bold text-2xl text-center">
            Let's get to know you
          </h1>

          {/* Subtitle */}
          <h2 className="dark:text-darkmodetext mt-1 text-sm text-darkbg/70 text-center">
            Tell us your name and choose a username to get started.
          </h2>

          {/* Image Input */}
          <div className="mt-10 flex flex-col items-center gap-y-5">
            <input
              className="hidden"
              type="file"
              ref={fileRef}
              accept="image/jpg, image/jpeg, image/png"
              onChange={handleFileChange}
            />
            <div className="flex justify-center">
              {image ? (
                <img
                  src={
                    typeof image == "string"
                      ? image
                      : URL.createObjectURL(image)
                  }
                  className="h-24 w-24 rounded-full"
                />
              ) : (
                <MdOutlineAccountCircle className="text-[8rem]" />
                // <img src={defaultAccount} className="h-24 w-24 rounded-full" />
              )}
            </div>
            <button
              onClick={() => {
                if (fileRef?.current) fileRef.current.click();
              }}
              className="cursor-pointer hover:border-darkbg dark:hover:border-white border-darkbg/25 dark:border-white/25 border-1 flex  gap-x-2 py-2 justify-center items-center px-14 shadow rounded-lg font-medium active:shadow transition-all disabled:text-greyText"
            >
              Upload <IoCloudUploadOutline className="translate-y-0.5" />
            </button>
          </div>

          {/* Name & Username */}
          <div className="mt-14 flex flex-col gap-y-8 lg:gap-x-5">
            {/* Name Input field */}
            <div className="lg:flex-1 px-2">
              <p className="font-medium">Name</p>
              <Input
                value={name}
                className="focus:border-darkbg dark:focus:border-white transition-all"
                onChange={(e) => {
                  setName(e.target.value);
                  if (
                    e.target.value != null &&
                    e.target.value != undefined &&
                    e.target.value.length > 0 &&
                    e.target.value.length < 30
                  ) {
                    setError((prev) => ({ ...prev, name: 0 }));
                    return;
                  }
                }}
                onBlur={() => {
                  if (name == null || name == undefined || name.length <= 0) {
                    setError((prev) => ({ ...prev, name: 1 }));
                    return;
                  } else if (name.length > 30) {
                    setError((prev) => ({ ...prev, name: 2 }));
                    return;
                  } else {
                    setError((prev) => ({ ...prev, name: 0 }));
                  }
                }}
                placeholder={"Enter your name"}
              />

              <ErrorStatement
                isOpen={error.name == 1}
                text={"Please enter your name."}
              />

              <ErrorStatement
                isOpen={error.name == 2}
                text={"Name cannot exceed 30 characters."}
              />
            </div>

            {/* Username Input field */}
            <div className="lg:flex-1 px-2">
              <p className="font-medium">Username</p>
              <Input
                className="focus:border-darkbg dark:focus:border-white transition-all"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);

                  if (
                    e.target.value != null &&
                    e.target.value != undefined &&
                    e.target.value.length > 0 &&
                    username.length < 20 &&
                    isValidUsername(username)
                  ) {
                    setError((prev) => ({ ...prev, username: 0 }));
                    return;
                  }
                }}
                onBlur={() => {
                  if (
                    username == null ||
                    username == undefined ||
                    username.length <= 0
                  ) {
                    setError((prev) => ({ ...prev, username: 1 }));
                    return;
                  } else if (username.length > 20) {
                    setError((prev) => ({ ...prev, username: 3 }));
                    return;
                  } else if (!isValidUsername(username)) {
                    setError((prev) => ({ ...prev, username: 4 }));
                    return;
                  } else {
                    setError((prev) => ({ ...prev, username: 0 }));
                  }
                }}
                placeholder={"Enter a username"}
              />

              <ErrorStatement
                isOpen={error.username == 1}
                text={"Please enter a username."}
              />

              <ErrorStatement
                isOpen={error.username == 2}
                text={"Username already exists."}
              />

              <ErrorStatement
                isOpen={error.username == 3}
                text={"Username cannot exceed 20 characters."}
              />

              <ErrorStatement
                isOpen={error.username == 4}
                text={"Username can contain alphabets, numbers and underscore."}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-10 flex justify-center items-center">
            <PrimaryButton
              className="w-full max-w-md"
              onClick={handleSubmit}
              disabled={disabled}
              disabledText={"Please Wait..."}
              text={"Submit"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;

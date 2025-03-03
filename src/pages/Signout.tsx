import { SecondaryButton } from "@/components";
import { auth } from "@/firebase/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Signout = () => {
  const navigate = useNavigate();

  // Scroll to the top of page
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Set window title.
  useEffect(() => {
    document.title = "Sign out | Grid Manager";
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <>
      <div className="min-h-[89vh] py-16 gap-10 flex flex-col justify-center items-center pb-24">
        {/* Title */}
        <h1 className="text-3xl lg:text-4xl font-medium">
          Do you want to sign out?
        </h1>
        {/* Image */}
        <img
          src={
            "https://res.cloudinary.com/do8rpl9l4/image/upload/v1736741825/signout_xm5pl2.svg"
          }
          className="max-w-[35%] -translate-x-2 lg:max-w-[20%] pointer-events-none"
        />
        {/* Button to log out */}
        <div>
          <SecondaryButton
            className="px-10"
            onClick={handleLogout}
            text={"Sign Out"}
          />
        </div>
      </div>
    </>
  );
};

export default Signout;

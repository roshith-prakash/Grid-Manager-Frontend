import { useState, useEffect } from "react";
import { getAuth, applyActionCode } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function VerifyEmail() {
  const [checking, setChecking] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const oobCode = params.get("oobCode");
    const auth = getAuth();

    if (!oobCode) {
      setChecking(false);
      return;
    }

    applyActionCode(auth, oobCode)
      .then(() => {
        toast.success("✅ Email verified successfully! You can now sign in.");
        navigate("/onboarding");
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setChecking(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="bg-white mx-auto mt-14 dark:border-1 dark:border-white/25 dark:bg-secondarydarkbg max-w-xl dark:bg-darkgrey dark:text-darkmodetext border-darkbg/25 border-1 px-8 lg:max-w-lg p-5 md:px-10 shadow-lg rounded-2xl pb-10">
        {/* Title */}
        <h1 className="dark:text-darkmodetext pt-5 font-bold text-2xl text-center">
          Email Verification
        </h1>

        {/* Subtitle */}
        {checking && (
          <h2 className="dark:text-darkmodetext mt-1 text-sm text-darkbg/70 text-center">
            Please wait while we verify your email address.
          </h2>
        )}

        {!checking && (
          <p className="text-center mt-5 text-red-500">
            Verification link is invalid or expired.
          </p>
        )}
      </div>
    </div>
  );
}

import { Checkbox, ErrorStatement, Input, PrimaryButton } from "@/components";
import { useDBUser } from "@/context/UserContext";
import { isValidTeamOrLeagueName } from "@/functions/regexFunctions";
import { axiosInstance } from "@/utils/axiosInstance";
import { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { RiErrorWarningLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";

const CreateLeague = () => {
  const [leagueName, setLeagueName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const navigate = useNavigate();

  const { dbUser } = useDBUser();

  const [error, setError] = useState({
    leagueName: 0,
  });

  const showPersistentToast = () => {
    toast(
      (t) => (
        <div className="flex items-center gap-4">
          <RiErrorWarningLine className="h-10 w-10" />
          <span>You can create or join a maximum of 5 leagues.</span>
          <button
            className="ml-auto px-3 py-1 bg-white text-red-600 font-medium rounded-md cursor-pointer transition"
            onClick={() => toast.dismiss(t.id)}
          >
            Dismiss
          </button>
        </div>
      ),
      { duration: Infinity } // Keeps the toast open indefinitely
    );
  };

  // Submit the data to the server to edit the user object.
  const handleSubmit = () => {
    setError({
      leagueName: 0,
    });

    if (
      leagueName == null ||
      leagueName == undefined ||
      leagueName.length <= 0
    ) {
      setError((prev) => ({ ...prev, leagueName: 1 }));
      return;
    } else if (!isValidTeamOrLeagueName(leagueName)) {
      setError((prev) => ({ ...prev, leagueName: 3 }));
      return;
    } else if (leagueName.length > 30) {
      setError((prev) => ({ ...prev, leagueName: 2 }));
      return;
    }
    setDisabled(true);

    axiosInstance
      .post("/team/create-league", {
        leagueName: leagueName,
        userId: dbUser?.id,
        isPrivate: isPrivate,
      })
      .then((res) => {
        setDisabled(false);
        navigate(`/leagues/${res?.data?.data?.leagueId}`);
      })
      .catch((err: AxiosError) => {
        if (err?.response?.status == 403) {
          showPersistentToast();
        } else {
          toast("Could not create league!");
        }
        setDisabled(false);
      });
  };

  return (
    <div className="min-h-[70vh] md:min-h-[65vh] lg:min-h-[60vh] bg-bgwhite flex items-center justify-center pt-12 pb-32">
      <div className="bg-white dark:bg-secondarydarkbg dark:border-white/10 dark:border-2 w-full dark:bg-darkgrey dark:text-darkmodetext border-1 max-w-[95%] md:max-w-3xl md:mt-5 lg:mt-5 p-5 md:px-20 shadow-xl rounded-xl pb-10">
        {/* Title */}
        <h1 className="text-hovercta dark:text-darkmodeCTA pt-5 font-bold text-2xl text-center">
          Create a League!
        </h1>

        {/* Name */}
        <div className="mt-14 flex flex-col gap-y-8 ">
          {/* Name Input field */}
          <div className="lg:flex-1 flex flex-col items-center px-2">
            <p className="font-medium">League Name</p>
            <Input
              value={leagueName}
              onChange={(e) => {
                setLeagueName(e.target.value);
                if (
                  e.target.value != null &&
                  e.target.value != undefined &&
                  e.target.value.length > 0 &&
                  isValidTeamOrLeagueName(e.target.value) &&
                  e.target.value.length < 30
                ) {
                  setError((prev) => ({ ...prev, leagueName: 0 }));
                  return;
                }
              }}
              onBlur={() => {
                if (
                  leagueName == null ||
                  leagueName == undefined ||
                  leagueName.length == 0
                ) {
                  setError((prev) => ({ ...prev, leagueName: 1 }));
                  return;
                } else if (!isValidTeamOrLeagueName(leagueName)) {
                  setError((prev) => ({ ...prev, leagueName: 3 }));
                  return;
                } else if (leagueName?.length > 30) {
                  setError((prev) => ({ ...prev, leagueName: 2 }));
                  return;
                } else {
                  setError((prev) => ({ ...prev, leagueName: 0 }));
                }
              }}
              className="max-w-xl"
              placeholder="Team Name"
            />

            <ErrorStatement
              isOpen={error.leagueName == 1}
              text={"Please enter the name for your league."}
            />

            <ErrorStatement
              isOpen={error.leagueName == 2}
              text={"League name cannot exceed 30 characters."}
            />

            <ErrorStatement
              isOpen={error.leagueName == 3}
              text={
                "League name must be at least 3 characters long and include at least one letter. It may also contain numbers and spaces."
              }
            />
          </div>

          {/* Private League field */}
          <div className="lg:flex-1 flex justify-center items-center px-2">
            <p className="font-medium">Make League Private?</p>
            <Checkbox
              className="translate-y-0.5"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          </div>

          <p className="text-center">
            ( Note : Private Leagues are not displayed in the Leagues page. )
          </p>
        </div>

        {/* Submit Button */}
        <div className="mt-10 flex justify-center items-center">
          <PrimaryButton
            onClick={handleSubmit}
            disabled={disabled}
            disabledText={"Please Wait..."}
            text={"Create League!"}
            className="w-full max-w-xs"
          />
        </div>
      </div>
    </div>
  );
};

export default CreateLeague;

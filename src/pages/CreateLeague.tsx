import { Checkbox, ErrorStatement, Input, PrimaryButton } from "@/components";
import { useDBUser } from "@/context/UserContext";
import { axiosInstance } from "@/utils/axiosInstance";
import { useState } from "react";
import toast from "react-hot-toast";
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
    } else if (leagueName.length > 30) {
      setError((prev) => ({ ...prev, leagueName: 2 }));
      return;
    }
    setDisabled(true);

    axiosInstance
      .post("/team/create-league", {
        leagueName: leagueName,
        user: dbUser,
        isPrivate: isPrivate,
      })
      .then((res) => {
        setDisabled(false);
        console.log(res?.data);
        navigate(`/leagues/${res?.data?.data?.leagueId}`);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not create league!");
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
          <div className="lg:flex-1 px-2">
            <p className="font-medium">League Name</p>
            <Input
              value={leagueName}
              className="focus:border-darkbg dark:focus:border-white transition-all"
              onChange={(e) => {
                setLeagueName(e.target.value);
                if (
                  e.target.value != null &&
                  e.target.value != undefined &&
                  e.target.value.length > 0 &&
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
                  leagueName.length <= 0
                ) {
                  setError((prev) => ({ ...prev, leagueName: 1 }));
                  return;
                } else if (leagueName.length > 30) {
                  setError((prev) => ({ ...prev, leagueName: 2 }));
                  return;
                } else {
                  setError((prev) => ({ ...prev, leagueName: 0 }));
                }
              }}
              placeholder={"Enter your name"}
            />

            <ErrorStatement
              isOpen={error.leagueName == 1}
              text={"Please enter the name for your league."}
            />

            <ErrorStatement
              isOpen={error.leagueName == 2}
              text={"League name cannot exceed 30 characters."}
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

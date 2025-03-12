import { axiosInstance } from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Input from "./reuseit/Input";
import ErrorStatement from "./ErrorStatement";
import Checkbox from "./reuseit/Checkbox";
import PrimaryButton from "./reuseit/PrimaryButton";
import { RxCross2 } from "react-icons/rx";

const EditLeagueModal = ({
  league,
  onClose,
  refetchFunction,
}: {
  league: { leagueId: string; private: boolean; name: string };
  onClose: () => void;
  refetchFunction: () => void;
}) => {
  const [leagueName, setLeagueName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [disabled, setDisabled] = useState(false);

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
      .post("/team/edit-league", {
        leagueId: league?.leagueId,
        leagueName: leagueName,
        isPrivate: isPrivate,
      })
      .then((res) => {
        setDisabled(false);
        refetchFunction();
        onClose();
        console.log(res?.data);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Could not create league!");
        setDisabled(false);
      });
  };

  useEffect(() => {
    if (league?.leagueId) {
      setLeagueName(league?.name);
      setIsPrivate(league?.private);
    }
  }, [league?.leagueId, league?.name, league?.private]);

  return (
    <div className="relative bg-white dark:bg-secondarydarkbg  w-full dark:bg-darkgrey dark:text-darkmodetext px-5">
      <button
        onClick={onClose}
        className="absolute  right-5 text-2xl cursor-pointer"
      >
        <RxCross2 />
      </button>

      {/* Title */}
      <h1 className="text-hovercta dark:text-darkmodeCTA pt-5 font-bold text-2xl text-center">
        Edit Your League!
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
          text={"Edit League!"}
          className="w-full max-w-xs"
        />
      </div>
    </div>
  );
};

export default EditLeagueModal;

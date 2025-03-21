/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  ErrorStatement,
  Input,
  PrimaryButton,
  SecondaryButton,
} from "@/components";
import {
  NUMBER_OF_CONSTRUCTORS,
  NUMBER_OF_DRIVERS,
} from "@/constants/constants";
import { axiosInstance } from "@/utils/axiosInstance";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaUserAlt } from "react-icons/fa";
import { IoIosAddCircleOutline } from "react-icons/io";
import { MdClose } from "react-icons/md";
import { isValidTeamOrLeagueName } from "@/functions/regexFunctions";

const EditTeamModal = ({
  teamId,
  onClose,
  refetchFunction,
}: {
  teamId: string;
  onClose: () => void;
  refetchFunction?: () => void;
}) => {
  // State for available drivers and constructors
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [availableConstructors, setAvailableConstructors] = useState([]);

  // State for team drivers and constructors
  const [teamDrivers, setTeamDrivers] = useState([]);
  const [teamConstructors, setTeamConstructors] = useState([]);

  // Available Budget
  const [availablePurse, setAvailablePurse] = useState(100);
  const [error, setError] = useState({
    name: 0,
  });

  // Name of the team
  const [name, setName] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [tabValue, setTabValue] = useState("drivers");

  const ref = useRef();

  const queryClient = useQueryClient();

  // Querying Drivers
  const { data: drivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      return axiosInstance.get("/team/get-drivers");
    },
    staleTime: Infinity,
  });

  // Querying Constructors
  const { data: constructors } = useQuery({
    queryKey: ["constructors"],
    queryFn: async () => {
      return axiosInstance.get("/team/get-constructors");
    },
    staleTime: Infinity,
  });

  const { data: team } = useQuery({
    queryKey: ["team", teamId],
    queryFn: async () => {
      return axiosInstance.post("/team/get-team-by-id", { teamId: teamId });
    },
    enabled: !!teamId,
  });

  // Set Team & available Drivers
  useEffect(() => {
    if (drivers?.data && team?.data) {
      const availDrivers = drivers?.data?.drivers;
      const selectedDrivers: string[] = team?.data?.team?.driverIds;

      setAvailableDrivers(
        availDrivers.filter(
          (driver) => !selectedDrivers?.includes(driver?.driverId)
        )
      );

      const remainingDrivers = availDrivers.filter((driver) =>
        selectedDrivers?.includes(driver?.driverId)
      );

      const selectedteam = team?.data?.team?.teamDrivers?.map((item) => {
        const foundObject = remainingDrivers.find(
          (remainingitem) => remainingitem.driverId == item?.driverId
        );

        return { ...item, points: foundObject?.points };
      });

      setTeamDrivers(selectedteam);
    } else {
      setAvailableDrivers([]);
    }
  }, [drivers, team?.data]);

  // Set team & available constructors
  useEffect(() => {
    if (constructors?.data && team?.data) {
      const availConstructor = constructors?.data?.constructors;
      const selectedConstructors: string[] = team?.data?.team?.constructorIds;

      setAvailableConstructors(
        availConstructor.filter(
          (constructor) =>
            !selectedConstructors?.includes(constructor?.constructorId)
        )
      );

      const remainingDrivers = availConstructor.filter((constructor) =>
        selectedConstructors?.includes(constructor?.constructorId)
      );

      const selectedteam = team?.data?.team?.teamConstructors?.map((item) => {
        const foundObject = remainingDrivers.find(
          (remainingitem) => remainingitem.constructorId == item?.constructorId
        );

        return { ...item, points: foundObject?.points };
      });

      setTeamConstructors(selectedteam);
    } else {
      setAvailableConstructors([]);
    }
  }, [constructors, team?.data]);

  useEffect(() => {
    if (team?.data) {
      setName(team?.data?.team?.name);
      setAvailablePurse(100 - team?.data?.team?.price);
    }
  }, [team?.data]);

  // To add driver
  const addDriver = (driver: any) => {
    if (
      !teamDrivers.some(
        (item) => item.permanentNumber == driver?.permanentNumber
      )
    ) {
      const selectedDriver = availableDrivers.find(
        (item) => item.permanentNumber == driver?.permanentNumber
      );

      // Ensure selectedDriver exists
      if (selectedDriver) {
        // Remove item from available items
        setAvailableDrivers((items) =>
          items.filter(
            (item) => item.permanentNumber != driver?.permanentNumber
          )
        );

        // Add item to dropped items
        setTeamDrivers((items) => [...items, selectedDriver]);
        setAvailablePurse((purse) => purse - selectedDriver?.price);
      }
    }
  };

  // To remove driver
  const removeDriver = (driver: any) => {
    if (
      !availableDrivers.some(
        (item) => item.permanentNumber == driver?.permanentNumber
      )
    ) {
      const selectedDriver = teamDrivers.find(
        (item) => item.permanentNumber == driver?.permanentNumber
      );

      // Ensure selectedDriver exists
      if (selectedDriver) {
        // Remove item from team
        setTeamDrivers((items) =>
          items.filter(
            (item) => item.permanentNumber != driver?.permanentNumber
          )
        );

        // Add item back to available constructors
        setAvailableDrivers((items) => [...items, selectedDriver]);

        setAvailablePurse((purse) => purse + selectedDriver?.price);
      }
    }
  };

  // To add constructor
  const addConstructor = (constructor: any) => {
    if (
      !teamConstructors.some(
        (item) => item.constructorId == constructor?.constructorId
      )
    ) {
      const selectedConstructor = availableConstructors.find(
        (item) => item.constructorId == constructor?.constructorId
      );

      // Ensure selectedConstructor exists
      if (selectedConstructor) {
        // Remove item from available items
        setAvailableConstructors((items) =>
          items.filter(
            (item) => item.constructorId != constructor?.constructorId
          )
        );

        // Add item to dropped items
        setTeamConstructors((items) => [...items, selectedConstructor]);
        setAvailablePurse((purse) => purse - selectedConstructor?.price);
      }
    }
  };

  // To remove constructor
  const removeConstructor = (constructor: any) => {
    if (
      !availableConstructors.some(
        (item) => item.constructorId == constructor?.constructorId
      )
    ) {
      const selectedConstructor = teamConstructors.find(
        (item) => item.constructorId == constructor?.constructorId
      );

      // Ensure selectedConstructor exists
      if (selectedConstructor) {
        // Remove item from team
        setTeamConstructors((items) =>
          items.filter(
            (item) => item.constructorId != constructor?.constructorId
          )
        );

        // Add item back to available constructors
        setAvailableConstructors((items) => [...items, selectedConstructor]);

        setAvailablePurse((purse) => purse + selectedConstructor?.price);
      }
    }
  };

  // Submit the team
  const handleSubmit = () => {
    setError({
      name: 0,
    });

    if (name == null || name == undefined || name.length == 0) {
      setError((prev) => ({ ...prev, name: 1 }));
      return;
    } else if (!isValidTeamOrLeagueName(name)) {
      setError((prev) => ({ ...prev, name: 3 }));
      return;
    } else if (name?.length > 30) {
      setError((prev) => ({ ...prev, name: 2 }));
      return;
    }
    if (availablePurse < 0) {
      toast.error("Purse exceeded!");
      return;
    }

    if (
      teamDrivers?.length === NUMBER_OF_DRIVERS &&
      teamConstructors?.length === NUMBER_OF_CONSTRUCTORS
    ) {
      setDisabled(true);
      axiosInstance
        .post("/team/edit-team", {
          teamId: teamId,
          teamDrivers: teamDrivers,
          teamConstructors: teamConstructors,
          teamName: name,
          price: Number(100 - availablePurse),
        })
        .then(async () => {
          toast.success("Team Edited!");
          await queryClient.refetchQueries({
            queryKey: ["team", teamId],
            refetchType: "active",
          });
          refetchFunction();
          setDisabled(false);
          onClose();
        })
        .catch((err) => {
          console.log(err);
          toast("Something went wrong!");
          setDisabled(false);
          onClose();
        });
    } else {
      toast("Please add 5 drivers & 2 constructors before creating a Team!");
    }
  };

  return (
    <div>
      <div ref={ref}></div>

      {/* Close div button */}
      <button
        onClick={onClose}
        className="absolute  right-5 text-2xl cursor-pointer"
      >
        <MdClose />
      </button>

      {/* Title */}
      <h1 className=" mb-10 pt-10 text-center font-medium text-4xl">
        {" "}
        Edit {team?.data?.team?.name}
      </h1>

      {/* Team Name */}
      <div className="px-4 py-5 flex flex-col items-center justify-center">
        <p className="font-medium">Team Name</p>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (
              e.target.value != null &&
              e.target.value != undefined &&
              e.target.value.length > 0 &&
              isValidTeamOrLeagueName(e.target.value) &&
              e.target.value.length < 30
            ) {
              setError((prev) => ({ ...prev, name: 0 }));
              return;
            }
          }}
          onBlur={() => {
            if (name == null || name == undefined || name.length == 0) {
              setError((prev) => ({ ...prev, name: 1 }));
              return;
            } else if (!isValidTeamOrLeagueName(name)) {
              setError((prev) => ({ ...prev, name: 3 }));
              return;
            } else if (name?.length > 30) {
              setError((prev) => ({ ...prev, name: 2 }));
              return;
            } else {
              setError((prev) => ({ ...prev, name: 0 }));
            }
          }}
          className="max-w-xl"
          placeholder="Team Name"
        />
        <ErrorStatement
          isOpen={error.name == 1}
          text={"Please enter a name for the team."}
        />
        <ErrorStatement
          isOpen={error.name == 2}
          text={"Team name cannot exceed 30 characters."}
        />
        <ErrorStatement
          isOpen={error.name == 3}
          text={
            "Team name must be at least 3 characters long and include at least one letter. It may also contain numbers and spaces."
          }
        />
      </div>

      {/* Submit Button */}
      <div className="mb-20 py-5 flex items-center justify-center gap-x-10">
        <PrimaryButton
          disabled={disabled}
          disabledText="Please Wait..."
          onClick={handleSubmit}
          text="Edit Team"
        />
      </div>

      {/* Available purse */}
      <h2
        className={` ${
          availablePurse < 0 ? "bg-red-500" : "bg-cta"
        }  text-white mb-10 mt-10 py-2 px-6 w-fit rounded-3xl font-semibold mx-auto text-center transition-all text-2xl`}
      >
        {" "}
        Available Purse : <span>{availablePurse} Cr.</span>
      </h2>

      {/* Add Drivers & Constructors*/}
      <div className="flex flex-col md:flex-row h-fit gap-y-16">
        <div className="flex md:w-[38%] flex-col justify-start items-center gap-y-10">
          <h1 className="border-b-4 w-full text-lg font-semibold text-center py-4">
            Your Team
          </h1>

          <p className="text-xl">Drivers</p>
          {/* Team Drivers */}
          <div>
            <div className="w-full flex flex-wrap gap-x-5 gap-y-12 justify-center px-4 py-5 lg:px-14">
              {/* Map Drivers */}
              {teamDrivers?.length > 0 &&
                teamDrivers
                  ?.sort((a, b) => b?.price - a?.price)
                  .map((driver: any) => {
                    return (
                      <div className="relative">
                        <div className=" h-24 w-24 border-b-2 rounded-full overflow-hidden">
                          {/* Image */}
                          <div
                            className="h-full w-full pt-2 flex items-end justify-center"
                            style={{
                              backgroundColor: driver?.constructor_color,
                            }}
                          >
                            {driver?.image ? (
                              <img
                                src={driver.image}
                                alt={driver.familyName}
                                className="object-cover"
                              />
                            ) : (
                              <FaUserAlt className="text-gray-400 text-4xl" />
                            )}
                          </div>

                          <div className="absolute z-5 -bottom-2 rounded-full border-2 bg-white dark:bg-secondarydarkbg dark:border-white/25 py-1 w-full">
                            <div>
                              <p className="text-sm text-center">
                                Price:{" "}
                                <span className="font-semibold text-nowrap">
                                  {driver?.price} Cr.
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Close Button */}
                          <button
                            onClick={() => {
                              removeDriver(driver);
                            }}
                            className="absolute border-2 -right-2 -top-2 bg-white dark:bg-secondarydarkbg dark:border-white/25 p-2 rounded-full cursor-pointer"
                          >
                            <MdClose />
                          </button>
                        </div>
                      </div>
                    );
                  })}

              {/* Map Empty Buttons */}
              {teamDrivers?.length < NUMBER_OF_DRIVERS &&
                Array(NUMBER_OF_DRIVERS - teamDrivers?.length)
                  ?.fill(null)
                  ?.map((_, index: number) => {
                    return (
                      <button className="h-24 w-24 border-2 dark:border-white/20 p-2 flex justify-center items-center rounded-full">
                        <p className="text-lg font-medium">
                          Driver {teamDrivers?.length + index + 1}
                        </p>
                      </button>
                    );
                  })}
            </div>
          </div>

          <p className="text-xl">Constructors</p>
          {/* Team Constructors */}
          <div>
            <div className="flex flex-wrap gap-5 justify-center gap-y-5 mx-5 px-2 py-5">
              {teamConstructors?.length > 0 &&
                teamConstructors
                  ?.sort((a, b) => b?.price - a?.price)
                  .map((constructor: any) => {
                    return (
                      <div className="relative">
                        <div className=" h-33 w-33 border-2 rounded-full overflow-hidden">
                          {/* Image */}
                          <div className="h-full w-full px-2 bg-white flex items-center justify-center">
                            {constructor.logo ? (
                              <img
                                src={constructor.logo}
                                alt={constructor.name}
                                className="object-cover"
                              />
                            ) : (
                              <FaUserAlt className="text-gray-400 text-4xl" />
                            )}
                          </div>

                          <div className="absolute z-5  left-1/2 -translate-x-1/2 w-full  -bottom-2 rounded-full border-2 bg-white dark:bg-secondarydarkbg dark:border-white/25 py-1 ">
                            <div>
                              <p className="text-sm text-center">
                                Price:{" "}
                                <span className="font-semibold text-nowrap">
                                  {constructor?.price} Cr.
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Close Button */}
                          <button
                            onClick={() => {
                              removeConstructor(constructor);
                            }}
                            className="absolute border-2 right-1 -top-1 bg-white dark:bg-secondarydarkbg dark:border-white/25 p-2 rounded-full cursor-pointer"
                          >
                            <MdClose />
                          </button>
                        </div>
                      </div>
                    );
                  })}

              {/* Map Empty Buttons */}
              {teamConstructors?.length < NUMBER_OF_CONSTRUCTORS &&
                Array(NUMBER_OF_CONSTRUCTORS - teamConstructors?.length)
                  ?.fill(null)
                  ?.map((_, index: number) => {
                    return (
                      <button className="flex justify-center h-33 w-33 items-center border-2 gap-2 dark:border-white/20 p-2 rounded-full">
                        <p>
                          Constructor {teamConstructors?.length + index + 1}
                        </p>
                      </button>
                    );
                  })}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex md:flex-1 flex-col gap-y-10">
          {/* Tab Buttons */}
          <div className="flex">
            {/* Drivers Tab Button */}
            <button
              onClick={() => setTabValue("drivers")}
              className={`flex-1 py-3 cursor-pointer transition-all duration-300 border-b-4 ${
                tabValue == "drivers" &&
                "text-cta border-cta dark:text-white dark:border-darkmodeCTA"
              }`}
            >
              Drivers
              <div className="flex justify-center pt-1 gap-1">
                {Array(NUMBER_OF_DRIVERS)
                  ?.fill(null)
                  ?.map((_, index: number) => {
                    return (
                      <div
                        className={`p-1 ${
                          teamDrivers?.length >= index + 1
                            ? "bg-cta"
                            : "bg-gray-400"
                        }  rounded-full`}
                      ></div>
                    );
                  })}
              </div>
            </button>
            {/* Constructors Tab Button */}
            <button
              onClick={() => setTabValue("constructors")}
              className={`flex-1 py-3 cursor-pointer transition-all duration-300 border-b-4  ${
                tabValue == "constructors" &&
                "text-cta border-cta dark:text-white dark:border-darkmodeCTA"
              }`}
            >
              Constructors
              <div className="flex justify-center pt-1 gap-1">
                {Array(NUMBER_OF_CONSTRUCTORS)
                  ?.fill(null)
                  ?.map((_, index: number) => {
                    return (
                      <div
                        className={`p-1 ${
                          teamConstructors?.length >= index + 1
                            ? "bg-cta"
                            : "bg-gray-400"
                        }  rounded-full`}
                      ></div>
                    );
                  })}
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="border-l-3 dark:border-white/15">
            <div className="flex md:flex-1 flex-col gap-y-5">
              <div className="flex flex-wrap gap-5 justify-center gap-y-5 mx-5 px-2 py-5">
                {/* Available Drivers */}
                {tabValue == "drivers" && (
                  <>
                    {availableDrivers
                      ?.sort((a, b) => b?.price - a?.price)
                      .map((driver: any) => {
                        return (
                          <>
                            <div className="flex max-w-64 w-full flex-col pb-3 text-center gap-y-1 border-2 overflow-hidden rounded border-white/15 shadow-lg">
                              {/* Driver Image Section */}
                              <div
                                className="h-full w-full flex items-end justify-center"
                                style={{
                                  backgroundColor: driver?.constructor_color,
                                }}
                              >
                                {driver?.image ? (
                                  <img
                                    src={driver.image}
                                    alt={driver.familyName}
                                    className="h-40 object-cover"
                                  />
                                ) : (
                                  <FaUserAlt className="text-gray-400 text-4xl" />
                                )}
                              </div>

                              {/* Driver Info Section */}
                              <div className="py-4 px-4 ">
                                <div className="px-4">
                                  <h3 className="text-lg text-ellipsis text-nowrap font-semibold">
                                    {driver?.givenName} {driver?.familyName} (
                                    {driver?.code})
                                  </h3>
                                  <p className="text-sm text-darkbg/70 dark:text-white/50">
                                    {driver?.constructor}
                                  </p>
                                  <p className="text-md">
                                    Points:{" "}
                                    <span className="font-semibold">
                                      {driver?.points}
                                    </span>
                                  </p>
                                  <p className="text-md">
                                    Price:{" "}
                                    <span className="font-semibold">
                                      {driver?.price} Cr.
                                    </span>
                                  </p>
                                </div>

                                <div className="mt-5">
                                  <SecondaryButton
                                    onClick={() => addDriver(driver)}
                                    disabled={
                                      teamDrivers?.length >= 5 ||
                                      availablePurse <= 0
                                    }
                                    className="!py-1.5 !px-3 flex justify-center items-center gap-2 mx-auto !w-[90%]"
                                    text={
                                      <>
                                        <IoIosAddCircleOutline className="text-lg" />
                                        <span>Add</span>
                                      </>
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </>
                        );
                      })}
                  </>
                )}

                {/* Available Constructors */}
                {tabValue == "constructors" && (
                  <>
                    {availableConstructors?.length > 0 ? (
                      availableConstructors
                        ?.sort((a, b) => b?.price - a?.price)
                        .map((constructor: any) => {
                          return (
                            <>
                              <div className="flex max-w-64 w-full flex-col pb-3 text-center gap-y-1 border-2 overflow-hidden rounded border-white/15 shadow-lg">
                                <div className="flex flex-col bg-white items-center pb-5 px-5 border-b-1">
                                  <img
                                    src={
                                      constructor?.logo
                                        ? constructor?.logo
                                        : "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742205725/F1_App_Red_Logo_White_Background_lkgsio.avif"
                                    }
                                    className="h-36 object-contain"
                                  />
                                  <img
                                    src={
                                      constructor?.carImage
                                        ? constructor?.carImage
                                        : "https://res.cloudinary.com/dvwdsxirc/image/upload/v1742206187/white-formula-one-car-side-view-photo-removebg-preview_ztz5ej.png"
                                    }
                                  />
                                </div>

                                <p className="pt-2 text-lg font-semibold">
                                  {constructor?.name}
                                </p>
                                <div>
                                  Points in season:{" "}
                                  <span className="font-semibold">
                                    {constructor?.points}
                                  </span>
                                </div>
                                <div>
                                  Price:{" "}
                                  <span className="font-semibold">
                                    {constructor?.price} Cr.
                                  </span>
                                </div>

                                <div className="py-3 px-4 flex justify-center">
                                  <SecondaryButton
                                    onClick={() => addConstructor(constructor)}
                                    disabled={
                                      teamConstructors?.length >= 2 ||
                                      availablePurse <= 0
                                    }
                                    className="!py-1.5 !w-[90%] !px-3 flex justify-center items-center gap-2"
                                    text={
                                      <>
                                        <IoIosAddCircleOutline className="text-lg" />
                                        <span>Add</span>
                                      </>
                                    }
                                  />
                                </div>
                              </div>
                            </>
                          );
                        })
                    ) : (
                      <p className="text-center">Add Constructors!</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <div className="pt-10 pb-5 flex justify-center">
        <SecondaryButton
          onClick={() => {
            ref?.current?.scrollIntoView({ behavior: "smooth" });
          }}
          text="Scroll to Top"
        />
      </div>
    </div>
  );
};

export default EditTeamModal;

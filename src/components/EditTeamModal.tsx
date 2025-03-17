/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Draggable,
  Droppable,
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
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaUserAlt } from "react-icons/fa";
import {
  IoIosAddCircleOutline,
  IoIosRemoveCircleOutline,
} from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import Accordion from "./reuseit/Accordion";

const EditTeamModal = ({
  teamId,
  onClose,
  refetchFunction,
}: {
  teamId: string;
  onClose: () => void;
  refetchFunction?: () => void;
}) => {
  // Setting up DND-KIT
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

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

  // Function to handle drag and drop
  const handleDragDrivers = (event) => {
    const { active, over } = event;
    const itemId = parseInt(active.id); // Extract the item ID once

    // Check if the item is being dropped onto a valid area
    if (over) {
      if (over.id === "team-drivers") {
        // Check if the item is already in the dropped items to prevent duplicates
        if (!teamDrivers.some((item) => item.permanentNumber === itemId)) {
          const draggedItem = availableDrivers.find(
            (item) => item.permanentNumber == itemId
          );

          // Ensure draggedItem exists
          if (draggedItem) {
            // Remove item from available items
            setAvailableDrivers((items) =>
              items.filter((item) => item.permanentNumber != itemId)
            );

            // Add item to dropped items
            setTeamDrivers((items) => [...items, draggedItem]);
            setAvailablePurse((purse) => purse - draggedItem?.price);
          }
        }
      } else if (over.id === "available-drivers") {
        // Prevent duplicate item drop in the same section
        if (!availableDrivers.find((item) => item.permanentNumber === itemId)) {
          const draggedItem = teamDrivers.find(
            (item) => item.permanentNumber == itemId
          );

          // Ensure draggedItem exists
          if (draggedItem) {
            // Remove item from team
            setTeamDrivers((items) =>
              items.filter((item) => item.permanentNumber != itemId)
            );

            // Add item back to available constructors
            setAvailableDrivers((items) => [...items, draggedItem]);

            setAvailablePurse((purse) => purse + draggedItem?.price);
          }
        }
      }
    } else {
      // When dropped outside both containers
      const draggedItem =
        availableDrivers.find((item) => item.permanentNumber === itemId) ||
        teamDrivers.find((item) => item.permanentNumber === itemId);

      // Ensure draggedItem exists before proceeding
      if (draggedItem) {
        // If dropped outside, reset the item to available items
        if (!availableDrivers.find((item) => item.permanentNumber === itemId)) {
          setAvailableDrivers((items) => [...items, draggedItem]);
        }

        // Remove the item from dropped items
        setTeamDrivers((items) =>
          items.filter((item) => item.permanentNumber !== itemId)
        );
      }
    }
  };

  // Function to handle drag and drop
  const handleDragConstructors = (event) => {
    const { active, over } = event;
    const itemId = parseInt(active.id); // Extract the item ID once

    // Check if the item is being dropped onto a valid area
    if (over) {
      if (over.id === "team-constructors") {
        // Check if the item is already in the dropped items to prevent duplicates
        if (
          !teamConstructors.some((item) => item.constructorNumber === itemId)
        ) {
          const draggedItem = availableConstructors.find(
            (item) => item.constructorNumber == itemId
          );

          // Remove item from available items
          setAvailableConstructors((items) =>
            items.filter((item) => item.constructorNumber != itemId)
          );

          // Add item to dropped items
          setTeamConstructors((items) => [...items, draggedItem]);
          setAvailablePurse((purse) => purse - draggedItem?.price);
        }
      } else if (over.id === "available-constructors") {
        // Prevent duplicate item drop in the same section
        if (
          !availableConstructors.find(
            (item) => item.constructorNumber === itemId
          )
        ) {
          const draggedItem = teamConstructors.find(
            (item) => item.constructorNumber == itemId
          );

          // Remove item from team
          setTeamConstructors((items) =>
            items.filter((item) => item.constructorNumber != itemId)
          );

          // Add item back to available constructors
          setAvailableConstructors((items) => [...items, draggedItem]);
          setAvailablePurse((purse) => purse + draggedItem?.price);
        }
      }
    } else {
      // When dropped outside both containers
      const draggedItem =
        availableConstructors.find((item) => item.id === itemId) ||
        teamConstructors.find((item) => item.id === itemId);

      if (draggedItem) {
        // If dropped outside, reset the item to available items
        if (!availableConstructors.find((item) => item.id === itemId)) {
          setAvailableConstructors((items) => [...items, draggedItem]);

          setAvailablePurse((purse) => purse + draggedItem?.price);
        }

        // Remove the item from dropped items
        setTeamConstructors((items) =>
          items.filter((item) => item.id !== itemId)
        );
      }
    }
  };

  // To add driver in Small Screens
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

  // To add driver in Small Screens
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

  // To add driver in Small Screens
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

  // To add driver in Small Screens
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
    } else if (name?.length > 30) {
      setError((prev) => ({ ...prev, name: 2 }));
      return;
    }
    if (availablePurse < 0) {
      toast.error("Purse cannot be negative!");
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
        <RxCross2 />
      </button>

      {/* Available purse */}
      <h1 className=" mb-10 pt-10 text-center font-medium text-4xl">
        {" "}
        Edit <span className="italic">{team?.data?.team?.name}</span>
      </h1>

      {/* Available purse */}
      <h2 className=" mb-10 pt-10 text-center font-medium text-2xl">
        {" "}
        Available Purse :{" "}
        <span className={`${availablePurse < 0 && "text-red-500"}`}>
          {availablePurse} Cr.
        </span>
      </h2>

      {/* Team Name */}
      <div className="pb-10 px-4 py-5 flex flex-col items-center justify-center">
        <p className="font-medium">Team Name</p>
        <Input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          onBlur={() => {
            if (name == null || name == undefined || name.length == 0) {
              setError((prev) => ({ ...prev, name: 1 }));
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
      </div>

      {/* Submit Button */}
      <div className="mb-20 py-5 flex items-center justify-center gap-x-10">
        <PrimaryButton
          disabled={disabled}
          disabledText="Please Wait..."
          onClick={handleSubmit}
          text="Create Team"
        />
      </div>

      {/* Drag and Drop - On Medium & large Screens */}
      <div className="hidden md:flex flex-col md:px-5 min-h-screen">
        {/* Drivers */}
        <div className="flex flex-wrap-reverse">
          <DndContext sensors={sensors} onDragEnd={handleDragDrivers}>
            {/* Available Drivers */}
            <div className="w-full lg:flex-1">
              <div className="flex justify-between px-6 text-2xl font-medium">
                <h3>Available Drivers</h3>
              </div>

              <Droppable
                id="available-drivers"
                className="p-5 border-2 m-5 flex flex-wrap gap-3 justify-center shadow-md"
              >
                {availableDrivers
                  ?.sort((a, b) => b?.price - a?.price)
                  .map((driver) => {
                    return (
                      <Draggable
                        className="flex flex-col items-start w-full max-w-48 rounded overflow-hidden border border-darkbg/50 dark:border-white/25 shadow-lg"
                        key={driver?.driverId}
                        id={`${driver?.permanentNumber}`}
                      >
                        {/* Driver Image Section */}
                        <div
                          className=" w-full flex items-end h-40 justify-center"
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
                        <div className="py-4 bg-white dark:bg-secondarydarkbg  text-center w-full">
                          <div className="px-4">
                            <h3 className="text-lg font-semibold">
                              {driver?.givenName} {driver?.familyName}
                            </h3>
                            <p> ({driver?.code})</p>
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
                        </div>
                      </Draggable>
                    );
                  })}
              </Droppable>
            </div>

            {/* Team Drivers */}
            <div className="w-full lg:flex-1">
              <div className="flex flex-wrap justify-between px-6 text-2xl font-medium">
                <h3>Team Drivers</h3>
                <h3
                  className={`${
                    teamDrivers?.length == NUMBER_OF_DRIVERS && "text-green-500"
                  } ${
                    teamDrivers?.length > NUMBER_OF_DRIVERS && "text-red-500"
                  }`}
                >
                  {teamDrivers?.length} / {NUMBER_OF_DRIVERS}
                </h3>
              </div>

              <Droppable
                id="team-drivers"
                className="p-5 border-2 m-5 flex flex-wrap gap-3 justify-center shadow-md"
              >
                {teamDrivers.length === 0 ? (
                  <p className="py-10">Add drivers</p>
                ) : (
                  teamDrivers
                    ?.sort((a, b) => b?.price - a?.price)
                    .map((driver) => (
                      <Draggable
                        className="flex flex-col items-start w-full max-w-48 rounded overflow-hidden border border-darkbg/50 dark:border-white/25 shadow-lg"
                        key={driver?.driverId}
                        id={`${driver?.permanentNumber}`}
                      >
                        {/* Driver Image Section */}
                        <div
                          className=" w-full flex items-end h-40 justify-center"
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
                        <div className="py-4 bg-white dark:bg-secondarydarkbg text-center w-full">
                          <div className="px-4">
                            <h3 className="text-lg font-semibold">
                              {driver?.givenName} {driver?.familyName}
                            </h3>
                            <p> ({driver?.code})</p>
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
                        </div>
                      </Draggable>
                    ))
                )}
              </Droppable>
            </div>
          </DndContext>
        </div>

        {/* Constructors */}
        <div className="flex flex-wrap-reverse mt-16">
          <DndContext sensors={sensors} onDragEnd={handleDragConstructors}>
            {/* Available Constructors */}
            <div className="w-full lg:flex-1">
              <div className="flex justify-between px-6 text-2xl font-medium">
                <h3>Available Constructors</h3>
              </div>

              <Droppable
                id="available-constructors"
                className="p-5 border-2 m-5 flex flex-wrap gap-3 justify-center shadow-md"
              >
                {availableConstructors
                  ?.sort((a, b) => b?.price - a?.price)
                  .map((constructor) => {
                    return (
                      <Draggable
                        className="border rounded-sm pb-5 flex flex-col gap-y-2 bg-white dark:bg-secondarydarkbg shadow-md w-full max-w-64 text-center"
                        key={constructor?.constructorId}
                        id={`${constructor?.constructorNumber}`}
                      >
                        {" "}
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
                        <div className="flex justify-center px-5"></div>
                        <p className=" text-xl font-semibold">
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
                      </Draggable>
                    );
                  })}
              </Droppable>
            </div>

            {/* Team Constructors */}
            <div className="w-full lg:flex-1">
              <div
                className={`flex flex-wrap justify-between px-6 text-2xl font-medium `}
              >
                <h3>Team Constructors</h3>
                <h3
                  className={`${
                    teamConstructors?.length == NUMBER_OF_CONSTRUCTORS &&
                    "text-green-500"
                  } ${
                    teamConstructors?.length > NUMBER_OF_CONSTRUCTORS &&
                    "text-red-500"
                  }`}
                >
                  {teamConstructors?.length} / {NUMBER_OF_CONSTRUCTORS}
                </h3>
              </div>

              <Droppable
                id="team-constructors"
                className="p-5 border-2 m-5 flex flex-wrap gap-3 justify-center shadow-md"
              >
                {teamConstructors.length === 0 ? (
                  <p className="py-10">Add Constructors</p>
                ) : (
                  teamConstructors
                    ?.sort((a, b) => b?.price - a?.price)
                    .map((constructor) => (
                      <Draggable
                        className="border rounded-sm pb-5 flex flex-col gap-y-2 bg-white dark:bg-secondarydarkbg shadow-md w-full max-w-64 text-center"
                        key={constructor?.constructorId}
                        id={`${constructor?.constructorNumber}`}
                      >
                        {" "}
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
                        <div className="flex justify-center px-5"></div>
                        <p className=" text-xl font-semibold">
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
                      </Draggable>
                    ))
                )}
              </Droppable>
            </div>
          </DndContext>
        </div>
      </div>

      {/* Add via Button- On Small Screens */}
      <div className="flex md:hidden flex-col gap-y-10">
        {/* Team Drivers */}
        <div className="flex flex-col gap-y-5">
          <div className="flex justify-between px-6 text-2xl font-medium">
            <h3>Team Drivers</h3>
            <span>
              {teamDrivers?.length} / {NUMBER_OF_DRIVERS}
            </span>
          </div>

          <div className="border-2 rounded-md border-darkbg/25 dark:border-white/25 flex flex-wrap gap-5 justify-center gap-y-5 mx-5 px-2 py-5">
            {teamDrivers?.length > 0 ? (
              teamDrivers
                ?.sort((a, b) => b?.price - a?.price)
                .map((driver: any) => {
                  return (
                    <>
                      <div className="flex flex-col w-full max-w-64 rounded overflow-hidden border border-darkbg/50 dark:border-white/25 shadow-lg">
                        {/* Driver Image Section */}
                        <div
                          className="h-full w-full flex items-center justify-center"
                          style={{ backgroundColor: driver?.constructor_color }}
                        >
                          {driver?.image ? (
                            <img
                              src={driver.image}
                              alt={driver.familyName}
                              className=" h-40 object-cover"
                            />
                          ) : (
                            <FaUserAlt className="text-gray-400 text-4xl" />
                          )}
                        </div>

                        {/* Driver Info Section */}
                        <div className="py-4 px-4">
                          <div className="px-4">
                            <h3 className="text-lg font-semibold">
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
                              onClick={() => removeDriver(driver)}
                              className="!py-1.5 !px-3 flex justify-center items-center gap-2 mx-auto !w-[90%]"
                              text={
                                <>
                                  <IoIosRemoveCircleOutline className="text-lg" />
                                  <span>Remove</span>
                                </>
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })
            ) : (
              <p className="text-center">Add Drivers!</p>
            )}
          </div>
        </div>

        {/* Available Drivers */}
        <div className="flex flex-col gap-y-5">
          <Accordion
            text={
              <div className="flex justify-between px-6 text-2xl font-medium">
                <h3>Available Drivers</h3>
              </div>
            }
          >
            <div className="border-2 rounded-md border-darkbg/25 dark:border-white/25 flex flex-wrap gap-5 justify-center gap-y-5 mx-5 px-2 py-5">
              {availableDrivers
                ?.sort((a, b) => b?.price - a?.price)
                .map((driver: any) => {
                  return (
                    <>
                      <div className="flex flex-col w-full max-w-64 rounded overflow-hidden border border-darkbg/50 dark:border-white/25 shadow-lg">
                        {/* Driver Image Section */}
                        <div
                          className="h-full w-full flex items-center justify-center"
                          style={{ backgroundColor: driver?.constructor_color }}
                        >
                          {driver?.image ? (
                            <img
                              src={driver.image}
                              alt={driver.familyName}
                              className=" h-40 object-cover"
                            />
                          ) : (
                            <FaUserAlt className="text-gray-400 text-4xl" />
                          )}
                        </div>

                        {/* Driver Info Section */}
                        <div className="py-4 px-4 ">
                          <div className="px-4">
                            <h3 className="text-lg font-semibold">
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
            </div>
          </Accordion>
        </div>

        {/* Team Constructors */}
        <div className="flex flex-col gap-y-5">
          <div className="flex justify-between px-6 text-2xl font-medium">
            <h3>Team Constructors</h3>
            <span>
              {teamConstructors?.length} / {NUMBER_OF_CONSTRUCTORS}
            </span>
          </div>

          <div className="border-2 rounded-md border-darkbg/25 dark:border-white/25 flex flex-wrap gap-5 justify-center gap-y-5 mx-5 px-2 py-5">
            {teamConstructors?.length > 0 ? (
              teamConstructors
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
                            onClick={() => removeConstructor(constructor)}
                            className="!py-1.5 !w-[90%] !px-3 flex justify-center items-center gap-2"
                            text={
                              <>
                                <IoIosRemoveCircleOutline className="text-lg" />
                                <span>Remove</span>
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
          </div>
        </div>

        {/* Available Constructors */}
        <div className="flex flex-col gap-y-5">
          <Accordion
            text={
              <div className="flex justify-between px-6 text-2xl font-medium">
                <h3>Available Constructors</h3>
              </div>
            }
          >
            <div className="border-2 rounded-md border-darkbg/25 dark:border-white/25 flex flex-wrap gap-5 justify-center gap-y-5 mx-5 px-2 py-5">
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
            </div>
          </Accordion>
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  Draggable,
  Droppable,
  ErrorStatement,
  Input,
  PrimaryButton,
} from "@/components";
import {
  NUMBER_OF_CONSTRUCTORS,
  NUMBER_OF_DRIVERS,
} from "@/constants/constants";
import { useDBUser } from "@/context/UserContext";
import { axiosInstance } from "@/utils/axiosInstance";
import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaUserAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const CreateTeamModal = ({
  leagueId,
  onClose,
  refetchFunction,
}: {
  leagueId: string;
  onClose: () => void;
  refetchFunction?: () => void;
}) => {
  // Setting up DND-KIT
  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  // Get User
  const { dbUser } = useDBUser();

  // Querying Drivers
  const { data: drivers } = useQuery({
    queryKey: ["drivers"],
    queryFn: async () => {
      return axiosInstance.get("/team/get-drivers");
    },
  });

  // Querying Constructors
  const { data: constructors } = useQuery({
    queryKey: ["constructors"],
    queryFn: async () => {
      return axiosInstance.get("/team/get-constructors");
    },
  });

  useEffect(() => {
    if (drivers?.data) {
      setAvailableDrivers(drivers?.data?.drivers);
    } else {
      setAvailableDrivers([]);
    }
  }, [drivers]);

  useEffect(() => {
    if (constructors?.data) {
      setAvailableConstructors(constructors?.data?.constructors);
    } else {
      setAvailableConstructors([]);
    }
  }, [constructors]);

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
        .post("/team/create-team", {
          user: dbUser,
          teamDrivers: teamDrivers,
          teamConstructors: teamConstructors,
          teamName: name,
          leagueId: leagueId,
          price: Number(100 - availablePurse),
        })
        .then(() => {
          toast("Team Created!");
          refetchFunction();
          setDisabled(false);
          onClose();
        })
        .catch(() => {
          toast("Something went wrong!");
          setDisabled(false);
          onClose();
        });
    } else {
      toast("Please Add drivers & constructors before creating a Team!");
    }
  };

  return (
    <div>
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
        Create A Team!
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

      <div className="md:px-5 min-h-screen">
        {/* Drivers */}
        <div className="flex flex-wrap-reverse">
          <DndContext sensors={sensors} onDragEnd={handleDragDrivers}>
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
                        className={`border-1 rounded-sm  bg-white dark:bg-darkbg`}
                        key={driver?.driverId}
                        id={`${driver?.permanentNumber}`}
                      >
                        <div
                          className="pt-2"
                          style={{
                            backgroundColor: driver?.constructor_color,
                          }}
                        >
                          {driver?.image ? (
                            <img src={driver?.image} className="h-32 mx-auto" />
                          ) : (
                            <FaUserAlt className="text-8xl mx-auto" />
                          )}
                        </div>
                        <div className="px-2.5">
                          <p className="pt-1">
                            {driver?.givenName} {driver?.familyName}
                          </p>
                          <p className="text-center">({driver?.code}) </p>
                          <p className="text-center">{driver?.constructor} </p>
                          <div className="border-t-1 mt-2 py-2">
                            Points in season : {driver?.points}
                          </div>
                          <div className="border-t-1 mt-2 py-2">
                            Price : {driver?.price} Cr.
                          </div>
                        </div>
                      </Draggable>
                    );
                  })}
              </Droppable>
            </div>

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
                        className={`border-1 rounded-sm  bg-white dark:bg-darkbg`}
                        key={driver?.driverId}
                        id={`${driver?.permanentNumber}`}
                      >
                        <div
                          className="pt-2"
                          style={{
                            backgroundColor: driver?.constructor_color,
                          }}
                        >
                          {driver?.image ? (
                            <img src={driver?.image} className="h-32 mx-auto" />
                          ) : (
                            <FaUserAlt className="text-8xl mx-auto" />
                          )}
                        </div>
                        <div className="px-2.5">
                          <p className="pt-1">
                            {driver?.givenName} {driver?.familyName}
                          </p>
                          <p className="text-center">({driver?.code}) </p>
                          <p className="text-center">{driver?.constructor} </p>
                          <div className="border-t-1 mt-2 py-2">
                            Points in season : {driver?.points}
                          </div>
                          <div className="border-t-1 mt-2 py-2">
                            Price : {driver?.price} Cr.
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
                        className="border-1 rounded-sm p-3 bg-white dark:bg-darkbg"
                        key={constructor?.constructorId}
                        id={`${constructor?.constructorNumber}`}
                      >
                        {constructor?.name}
                        <div className="border-t-1 mt-2 py-2">
                          Points in season : {constructor?.points}
                        </div>
                        <div className="border-t-1 mt-2 py-2">
                          {constructor?.price} Cr.
                        </div>
                      </Draggable>
                    );
                  })}
              </Droppable>
            </div>

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
                        className="border-1 rounded-sm p-3 bg-white dark:bg-darkbg"
                        key={constructor?.constructorId}
                        id={`${constructor?.constructorNumber}`}
                      >
                        {constructor?.name}
                        <div className="border-t-1 mt-2 py-2">
                          Points in season : {constructor?.points}
                        </div>
                        <div className="border-t-1 mt-2 py-2">
                          {constructor?.price} Cr.
                        </div>
                      </Draggable>
                    ))
                )}
              </Droppable>
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
};

export default CreateTeamModal;

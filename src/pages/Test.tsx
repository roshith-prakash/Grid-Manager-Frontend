// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Draggable, Droppable, PrimaryButton } from "@/components";
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

const NUMBER_OF_CONSTRUCTORS = 2;
const NUMBER_OF_DRIVERS = 3;

const Test = () => {
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
        if (!teamConstructors.some((item) => item.id === itemId)) {
          const draggedItem = availableConstructors.find(
            (item) => item.id == itemId
          );

          // Remove item from available items
          setAvailableConstructors((items) =>
            items.filter((item) => item.id != itemId)
          );

          // Add item to dropped items
          setTeamConstructors((items) => [...items, draggedItem]);
        }
      } else if (over.id === "available-constructors") {
        // Prevent duplicate item drop in the same section
        if (!availableConstructors.find((item) => item.id === itemId)) {
          const draggedItem = teamConstructors.find(
            (item) => item.id == itemId
          );

          // Remove item from team
          setTeamConstructors((items) =>
            items.filter((item) => item.id != itemId)
          );

          // Add item back to available constructors
          setAvailableConstructors((items) => [...items, draggedItem]);
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
    if (
      teamDrivers?.length === NUMBER_OF_DRIVERS &&
      teamConstructors?.length === NUMBER_OF_CONSTRUCTORS
    ) {
      axiosInstance
        .post("/team/create-team", {
          user: dbUser,
          teamDrivers: teamDrivers,
          teamConstructors: teamConstructors,
        })
        .then(() => toast("Team Created!"))
        .catch(() => toast("Something went wrong!"));
    } else {
      toast("Please Add drivers & constructors before creating a Team!");
    }
  };

  return (
    <div>
      <div className="px-5 py-10 min-h-screen">
        {/* Drivers */}
        <div className="flex">
          <DndContext sensors={sensors} onDragEnd={handleDragDrivers}>
            <div className="flex-1">
              <div className="flex justify-between px-6 text-2xl font-medium">
                <h3>Available Drivers</h3>
              </div>

              <Droppable
                id="available-drivers"
                className="p-5 border-2 m-5 flex flex-wrap gap-3 justify-center shadow-md"
              >
                {availableDrivers.map((driver) => {
                  return (
                    <Draggable
                      className="border-1 rounded-sm p-3 bg-white dark:bg-darkbg"
                      key={driver?.driverId}
                      id={`${driver?.permanentNumber}`}
                    >
                      {driver?.givenName} {driver?.familyName}
                    </Draggable>
                  );
                })}
              </Droppable>
            </div>

            <div className="flex-1">
              <div className="flex justify-between px-6 text-2xl font-medium">
                <h3>Team Drivers</h3>
                <h3>
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
                  teamDrivers.map((driver) => (
                    <Draggable
                      className="border-1 rounded-sm p-3 bg-white dark:bg-darkbg"
                      key={driver?.driverId}
                      id={`${driver?.permanentNumber}`}
                    >
                      {driver?.givenName} {driver?.familyName}
                    </Draggable>
                  ))
                )}
              </Droppable>
            </div>
          </DndContext>
        </div>

        {/* Constructors */}
        <div className="flex">
          <DndContext sensors={sensors} onDragEnd={handleDragConstructors}>
            <div className="flex-1">
              <div className="flex justify-between px-6 text-2xl font-medium">
                <h3>Available Constructors</h3>
              </div>

              <Droppable
                id="available-constructors"
                className="p-5 border-2 m-5 flex flex-wrap gap-3 justify-center shadow-md"
              >
                {availableConstructors.map((constructor) => {
                  return (
                    <Draggable
                      className="border-1 rounded-sm p-3 bg-white dark:bg-darkbg"
                      key={constructor?.constructorId}
                      id={`${constructor?.id}`}
                    >
                      {constructor?.name}
                    </Draggable>
                  );
                })}
              </Droppable>
            </div>

            <div className="flex-1">
              <div className="flex justify-between px-6 text-2xl font-medium">
                <h3>Team Constructors</h3>
                <h3>
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
                  teamConstructors.map((constructor) => (
                    <Draggable
                      className="border-1 rounded-sm p-3 bg-white dark:bg-darkbg"
                      key={constructor?.constructorId}
                      id={`${constructor?.id}`}
                    >
                      {constructor?.name}
                    </Draggable>
                  ))
                )}
              </Droppable>
            </div>
          </DndContext>
        </div>
      </div>

      {/* Submit Button */}
      <div className="pb-10 py-5 flex justify-center">
        <PrimaryButton onClick={handleSubmit} text="Create Team" />
      </div>
    </div>
  );
};

export default Test;

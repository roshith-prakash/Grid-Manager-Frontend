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

const Test = () => {
  // Fetch current user information from database - UseQuery Method
  const { data } = useQuery({
    queryKey: ["drivers"], // Use user ID for efficiency
    queryFn: async () => {
      return axiosInstance.get("/team/get-drivers");
    },
  });

  useEffect(() => {
    if (data?.data) {
      setAvailableDrivers(data?.data?.drivers);
    } else {
      setAvailableDrivers([]);
    }
  }, [data]);

  const { dbUser } = useDBUser();

  const mouseSensor = useSensor(MouseSensor);
  const touchSensor = useSensor(TouchSensor);
  const keyboardSensor = useSensor(KeyboardSensor);

  const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

  // The available Drivers
  const [availableDrivers, setAvailableDrivers] = useState([]);

  // The drivers added to the team
  const [teamDrivers, setTeamDrivers] = useState([]);

  // Function to handle drag and drop
  // Function to handle drag and drop
  const handleDragEnd = (event) => {
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

          console.log("Selected driver :", draggedItem);

          // Remove item from available items
          setAvailableDrivers((items) =>
            items.filter((item) => item.permanentNumber != itemId)
          );

          // Add item to dropped items and subtract the price from available purse
          setTeamDrivers((items) => [...items, draggedItem]);
        }
      } else if (over.id === "available-drivers") {
        // Prevent purse update when an item is dropped back into the same container
        if (!availableDrivers.find((item) => item.permanentNumber === itemId)) {
          const draggedItem = teamDrivers.find(
            (item) => item.permanentNumber == itemId
          );

          // Remove item from dropped items
          setTeamDrivers((items) =>
            items.filter((item) => item.permanentNumber != itemId)
          );

          // Add item back to available items without updating the purse
          setAvailableDrivers((items) => [...items, draggedItem]);
          // No purse update here, as the item is returned to the available list
        }
      }
    } else {
      // When dropped outside both containers
      const draggedItem =
        availableDrivers.find((item) => item.driverId === itemId) ||
        teamDrivers.find((item) => item.driverId === itemId);

      if (draggedItem) {
        // If dropped outside, reset the item to available items and update the purse
        if (!availableDrivers.find((item) => item.driverId === itemId)) {
          setAvailableDrivers((items) => [...items, draggedItem]);
        }

        // Remove the item from dropped items
        setTeamDrivers((items) =>
          items.filter((item) => item.driverId !== itemId)
        );
      }
    }
  };

  const handleSubmit = () => {
    if (teamDrivers?.length > 0) {
      axiosInstance
        .post("/team/create-team", {
          user: dbUser,
          team: teamDrivers,
        })
        .then((res) => console.log(res?.data))
        .catch((err) => console.error(err));
    } else {
      toast("Please Add drivers before Creating a Team!");
    }
  };

  console.log(dbUser);

  return (
    <div>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="px-5 py-10  min-h-screen">
          <div className="flex">
            {/* Container for all drivers */}
            <div className="flex-1">
              <h3 className="text-2xl font-medium">Available Drivers</h3>

              <div
                id="available-drivers"
                className="border-2 p-5 m-5 flex flex-wrap gap-5 justify-center  shadow-md"
              >
                {availableDrivers.map((item) => {
                  return (
                    <Draggable
                      key={item.driverId}
                      id={`${item.permanentNumber}`}
                    >
                      {item?.givenName} {item?.familyName}
                    </Draggable>
                  );
                })}
              </div>
            </div>

            {/* Droppable Container */}
            <div className="flex-1">
              <h3 className="text-2xl font-medium">Team</h3>

              <Droppable id="team-drivers">
                {teamDrivers.length === 0 ? (
                  <p>Add drivers</p>
                ) : (
                  teamDrivers.map((item) => (
                    <Draggable
                      key={item.driverId}
                      id={`${item.permanentNumber}`}
                    >
                      {item?.givenName} {item?.familyName}
                    </Draggable>
                  ))
                )}
              </Droppable>
            </div>
          </div>
        </div>
        <div className="pb-10 py-5 flex justify-center">
          <PrimaryButton onClick={handleSubmit} text="Create Team" />
        </div>
      </DndContext>
    </div>
  );
};

export default Test;

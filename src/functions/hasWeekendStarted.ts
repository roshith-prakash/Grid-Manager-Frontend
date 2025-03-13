import { useGetNextRace } from "@/context/NextRaceContext";

export const useHasWeekendStarted = () => {
  const { nextRace } = useGetNextRace();

  const raceDate = new Date(`${nextRace?.date}T${nextRace?.time}`);
  raceDate.setDate(raceDate.getDate() + 1);

  const FreePractice = new Date(
    `${nextRace?.FirstPractice?.date}T${nextRace?.FirstPractice?.time}`
  );

  return new Date() > FreePractice && new Date() < raceDate;
};

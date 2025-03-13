import { useState, useEffect } from "react";

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
} | null;

const Countdown = ({ targetDate }: { targetDate: string }) => {
  const calculateTimeLeft = (): TimeLeft => {
    const now = new Date();
    const difference = new Date(targetDate).getTime() - now.getTime();

    if (difference <= 0) {
      return {
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
      };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {
      days,
      hours,
      minutes,
      seconds,
    };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      const updatedTimeLeft = calculateTimeLeft();
      if (updatedTimeLeft) {
        setTimeLeft(updatedTimeLeft);
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);

  return (
    <>
      {timeLeft && (
        <div className="flex flex-col items-center p-4">
          <div className="grid grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-6xl font-semibold">
                {timeLeft.days}
              </p>
              <p className="text-sm md:text-lg">Days</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-semibold">
                {timeLeft.hours}
              </p>
              <p className="text-sm md:text-lg">Hours</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-semibold">
                {timeLeft.minutes}
              </p>
              <p className="text-sm md:text-lg">Minutes</p>
            </div>
            <div>
              <p className="text-4xl md:text-6xl font-semibold">
                {timeLeft.seconds}
              </p>
              <p className="text-sm md:text-lg">Seconds</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Countdown;

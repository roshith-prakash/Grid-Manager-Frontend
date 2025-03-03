import { useEffect } from "react";

const Landing = () => {
  // Set window title.
  useEffect(() => {
    document.title = "Home | Grid Manager";
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col items-center gap-10 justify-center">
      <h1 className="text-center font-mono  text-5xl  font-medium">
        Welcome to Grid Manager!
      </h1>
      <h2 className="text-center font-mono  text-3xl  font-medium">
        Work in Progress...
      </h2>
    </div>
  );
};

export default Landing;

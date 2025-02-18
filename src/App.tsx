import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Landing } from "@/pages";
import { useUser } from "@clerk/clerk-react";

function App() {
  const { user } = useUser();

  console.log("User : ", user);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

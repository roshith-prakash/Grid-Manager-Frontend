import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  EditProfile,
  Landing,
  Login,
  Onboarding,
  Signout,
  Signup,
  Test,
} from "@/pages";
import { Footer, Navbar, Protector } from "./components";

function App() {
  return (
    <main className="dark:bg-darkbg dark:text-darkmodetext">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/signout" element={<Signout />} />
          <Route path="/edit-profile" element={<EditProfile />} />

          <Route
            path="/test"
            element={
              <Protector>
                <Test />
              </Protector>
            }
          />
        </Routes>
        <Footer />
      </BrowserRouter>
    </main>
  );
}

export default App;

import { Header, PrimaryButton, SecondaryButton } from "@/components";

const Landing = () => {
  return (
    <div>
      <Header />
      <p>Grid Manager - Fantasy F1 brought to life!</p>
      <div>
        <PrimaryButton text="Test" />
        <SecondaryButton text="Test" />
      </div>
    </div>
  );
};

export default Landing;

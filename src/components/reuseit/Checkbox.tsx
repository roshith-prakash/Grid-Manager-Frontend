import { ChangeEventHandler, useState, useEffect } from "react";
import { TiTick } from "react-icons/ti";

const Checkbox = ({
  value,
  name,
  id,
  onChange,
  checked: controlledChecked = false,
  className = "",
  disabled,
}: {
  value?: string;
  name?: string;
  id?: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  checked?: boolean;
  className?: string;
  disabled?: boolean;
}) => {
  const [checked, setChecked] = useState<boolean>(controlledChecked);

  // Sync with controlled checked prop
  useEffect(() => {
    setChecked(controlledChecked);
  }, [controlledChecked]);

  const handleChange = () => {
    const newCheckedState = !checked;
    setChecked(newCheckedState);
    // Trigger the onChange function and pass the checkbox value and new checked state
    onChange({
      target: { value, checked: newCheckedState },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="inline-block">
      <input
        id={id}
        disabled={disabled}
        type="checkbox"
        className="hidden"
        value={value}
        name={name}
        checked={checked}
        onChange={onChange}
      />
      <button
        disabled={disabled}
        role="checkbox"
        onClick={handleChange}
        className={`border-darkbg disabled:text-darkbg disabled:bg-grey dark:border-darkmodetext mx-2 h-5 w-5 cursor-pointer rounded border-2 disabled:cursor-default ${checked ? "bg-cta text-white" : "bg-transparent"} ${className}`}
      >
        {checked && <TiTick />}
      </button>
    </div>
  );
};

export default Checkbox;

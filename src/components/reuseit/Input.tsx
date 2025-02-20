import { ChangeEventHandler, FocusEventHandler } from "react";

// Styled Text input
const Input = ({
  value,
  placeholder,
  onChange,
  onBlur,
  className = "",
  disabled,
}: {
  value: string;
  placeholder: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onBlur?: FocusEventHandler<HTMLInputElement>;
  className?: string;
  disabled?: boolean;
}) => {
  return (
    <input
      type="text"
      disabled={disabled}
      className={`dark:placeholder:text-grey/50 placeholder:text-darkbg/50 text-md border-darkbg/25 shadow mt-3 min-h-8 w-full rounded-lg border-1 bg-transparent px-4 py-2 placeholder:text-sm focus:outline-none dark:border-white/50 ${className}`}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

export default Input;

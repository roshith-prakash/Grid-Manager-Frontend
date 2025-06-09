import { MouseEventHandler, ReactNode } from "react";

const PrimaryButton = ({
  text,
  onClick,
  className,
  disabled,
  disabledText = "",
}: {
  text: string | ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  className?: string;
  disabled?: boolean;
  disabledText?: string;
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`border-cta bg-cta hover:bg-hovercta hover:border-hovercta dark:bg-hovercta dark:border-hovercta dark:hover:bg-cta dark:hover:border-cta disable w-fit min-w-14 rounded-full border-2 px-5 py-2 text-white transition-all disabled:border-gray-500 disabled:hover:border-gray-500 disabled:bg-gray-500 disabled:hover:bg-gray-500 ${
        !disabled && "cursor-pointer"
      } ${className}`}
    >
      {disabled ? (disabledText.length > 0 ? disabledText : text) : text}
    </button>
  );
};

export default PrimaryButton;

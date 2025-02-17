import { MouseEventHandler, ReactNode } from "react";

const SecondaryButton = ({
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
      className={`border-cta text-cta hover:bg-cta dark:hover:text-darkbg w-fit min-w-14 rounded-full border-2 px-5 py-[0.40rem] transition-all hover:scale-105 hover:text-white disabled:border-gray-600 disabled:text-gray-600 disabled:hover:scale-100 disabled:hover:bg-transparent dark:border-white dark:text-white dark:hover:bg-white dark:disabled:border-gray-400 dark:disabled:text-gray-400 ${!disabled && "cursor-pointer"} ${className}`}
    >
      {disabled ? (disabledText.length > 0 ? disabledText : text) : text}
    </button>
  );
};

export default SecondaryButton;

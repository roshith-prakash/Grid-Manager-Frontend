import { ReactNode, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const Accordion = ({
  text,
  children,
  className,
}: {
  text: string | ReactNode;
  children: ReactNode;
  className?: string;
}) => {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={`border-secondarydarkbg/25 dark:border-grey/25 w-full ${className}`}
    >
      <button
        className="flex w-full py-3 cursor-pointer items-center justify-between"
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        {text}
        <IoIosArrowDown
          className={`${
            isOpen && "rotate-180"
          } text-2xl mr-6 mt-2 transition-all duration-500`}
        />
      </button>
      <div
        ref={contentRef}
        className={`overflow-hidden transition-[max-height] duration-500 ease-in-out ${
          isOpen ? "max-h-[99999px]" : "max-h-0"
        }`}
        style={{
          maxHeight: isOpen ? `${contentRef.current?.scrollHeight}px` : "0px",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default Accordion;

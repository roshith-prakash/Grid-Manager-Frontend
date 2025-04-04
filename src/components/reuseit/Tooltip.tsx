import { useState, ReactNode } from "react";

interface TooltipProps {
  text: string;
  displayed?: boolean;
  children: ReactNode;
  className?: string;
  position?: "top" | "bottom" | "left" | "right";
}

const Tooltip = ({
  text,
  displayed = true,
  children,
  className,
  position = "bottom",
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);

  const positionStyles: { [key: string]: string } = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2",
    left: "right-full top-1/2 transform -translate-y-1/2 -translate-x-2",
    right: "left-full top-1/2 transform -translate-y-1/2 translate-x-2",
  };

  return (
    <div
      className="relative flex items-center justify-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}

      {displayed && (
        <div
          className={`absolute w-max max-w-3xs text-center z-10 rounded-lg px-4 py-2 text-sm ${
            visible ? "opacity-100" : "opacity-0"
          } dark:bg-darkbg bg-white shadow-lg transition-all duration-300 ${className} ${
            positionStyles[position]
          }`}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;

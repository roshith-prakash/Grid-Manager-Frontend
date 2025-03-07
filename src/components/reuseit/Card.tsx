import { CSSProperties, ReactNode } from "react";

const Card = ({
  children,
  style,
  className,
}: {
  children: ReactNode;
  style?: CSSProperties;
  className?: string;
}) => {
  return (
    <div
      className={`dark:bg-secondarydarkbg  overflow-hidden rounded-xl border-[1px] border-white bg-white shadow-2xl  ${className}`}
      style={style}
    >
      {children}
    </div>
  );
};

export default Card;

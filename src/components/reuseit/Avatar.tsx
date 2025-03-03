import { useEffect, useState } from "react";

const Avatar = ({
  imageSrc = "",
  fallBackText,
  className,
  border = false,
  borderClassName,
}: {
  imageSrc?: string;
  fallBackText?: string;
  className?: string;
  border?: boolean;
  borderClassName?: string;
}) => {
  const [isValid, setIsValid] = useState<boolean | undefined>(undefined);

  const checkImage = (imageUrl: string) => {
    const img = new Image();
    img.src = imageUrl;
    img.onload = () => setIsValid(true);
    img.onerror = () => setIsValid(false);
  };

  // Run the check when the component mounts or the URL changes
  useEffect(() => {
    checkImage(imageSrc);
  }, [imageSrc]);

  // Extract first letters of fallBack text
  const extractFirstLetters = (str: string) => {
    const words = str.split(" ");
    return words.length === 1
      ? words[0][0]
      : words[0][0] + words[words.length - 1][0];
  };

  return (
    <div
      className={`${
        border &&
        ` ${borderClassName} flex items-center justify-center rounded-full`
      } w-fit p-1`}
    >
      {isValid ? (
        <img
          src={imageSrc}
          alt={fallBackText}
          className={` ${
            border &&
            `dark:border-secondarydarkbg border-2 border-white ${borderClassName} `
          } h-10 w-10 rounded-full ${className}`}
        />
      ) : fallBackText ? (
        <p
          className={`${
            border &&
            `dark:border-secondarydarkbg ${borderClassName} border-2 border-white`
          } from-cta to-hovercta flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-lg font-semibold text-white ${className}`}
        >
          {extractFirstLetters(fallBackText)}
        </p>
      ) : (
        <img
          src={
            "https://res.cloudinary.com/do8rpl9l4/image/upload/v1738212915/image_1_jy29je.jpg"
          }
          className={` ${
            border &&
            `dark:border-secondarydarkbg border-2 border-white ${borderClassName} `
          } h-10 w-10 rounded-full ${className}`}
        />
      )}
    </div>
  );
};

export default Avatar;

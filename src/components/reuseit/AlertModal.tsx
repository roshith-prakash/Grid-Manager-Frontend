import { useEffect, useState, ReactNode } from "react";

const AlertModal = ({
  isOpen,
  onClose,
  children,
  className,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) => {
  // If the AlertModal is closing - to animate modal fading out
  const [isClosing, setIsClosing] = useState(false);
  // If the modal is to be displayed
  const [isMounted, setIsMounted] = useState(false);

  // When isOpen is true, set isMounted to mount the modal.
  // When isOpen is false (modal is closed by user) & if the modal is mounted, set isClosing to true to animate modal fading out.
  // After 300 ms, set isMounted to false to unmount the modal.
  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      setIsClosing(false);
    } else if (isMounted) {
      setIsClosing(true);
      setTimeout(() => {
        setIsMounted(false);
        setIsClosing(false);
        onClose();
      }, 300);
    }
  }, [isOpen, isMounted, onClose]);

  if (!isMounted) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-darkbg/80 transition-opacity ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* When isClosing is true, fadeOut animation is added to AlertModal */}
      <div
        className={`dark:bg-secondarydarkbg scroller ${
          isClosing ? "animate-fadeOut" : "animate-fadeIn"
        } relative max-h-[90%] w-auto max-w-[95%] min-w-xs overflow-y-auto rounded-xl bg-white p-6 shadow-xl  md:min-w-sm dark:border-3 dark:border-white/25 ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default AlertModal;

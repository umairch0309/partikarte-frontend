import { useState, useEffect } from "react";

const useIsMobileWidth = () => {
  const [isMobileWidth, setIsMobileWidth] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileWidth(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return isMobileWidth;
};

export default useIsMobileWidth;

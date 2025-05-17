
import { useState, useEffect } from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Initialize with a default that's safe for SSR (e.g., false).
  // This ensures consistent server-rendered output before client-side check.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side
    const checkDevice = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    // Check on mount to set the correct initial client-side value
    checkDevice();

    // Add event listener for window resize
    window.addEventListener("resize", checkDevice);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
      window.removeEventListener("resize", checkDevice);
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleans up on unmount

  return isMobile;
}

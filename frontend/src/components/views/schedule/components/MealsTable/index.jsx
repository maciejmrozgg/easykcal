import { useEffect, useState } from "react";
import MealsTableDesktop from "./desktop/MealsTableDesktop";
import MealsTableMobile from "./mobile/MealsTableMobile";

const MOBILE_QUERY = "(max-width: 768px)";

const MealsTable = (props) => {
  const [isMobile, setIsMobile] = useState(
    window.matchMedia(MOBILE_QUERY).matches
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const handler = () => setIsMobile(media.matches);

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, []);

  return isMobile
    ? <MealsTableMobile {...props} />
    : <MealsTableDesktop {...props} />;
};

export default MealsTable;
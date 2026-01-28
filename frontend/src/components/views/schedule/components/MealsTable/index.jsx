import MealsTableDesktop from "./desktop/MealsTableDesktop";
import MealsTableMobile from "./mobile/MealsTableMobile";
import useMediaQuery from "../../../../../hooks/useMediaQuery";

const MealsTable = (props) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return isMobile
    ? <MealsTableMobile {...props} />
    : <MealsTableDesktop {...props} />;
};

export default MealsTable;
import MealsTableDesktop from "./MealsTableDesktop";
import MealsTableMobile from "./MealsTableMobile";

const MealsTable = (props) => {
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

  return isMobile
    ? <MealsTableMobile {...props} />
    : <MealsTableDesktop {...props} />;
};

export default MealsTable;
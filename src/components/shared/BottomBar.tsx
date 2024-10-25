import { bottomBarLinks } from "@/constants";
import { IBottomBarLinks } from "@/interfaces";
import { NavLink, useLocation } from "react-router-dom";

const BottomBar = () => {
  const { pathname } = useLocation();
  return (
    <nav className="bottom-bar">
      {bottomBarLinks.map((link: IBottomBarLinks) => {
        const isActive = link.route === pathname;
        return (
          <NavLink
            key={link.label}
            className={`${
              isActive && "bg-primary-500 rounded-2xl"
            } flex-center flex-col gap-1 py-2 px-4 transition`}
            to={link.route}
          >
            <img
              src={link.imgURL}
              alt={link.label}
              width={20}
              height={20}
              className={`group-hover:invert-white ${
                isActive && "invert-white"
              }`}
            />
            <p className="text-xs text-light-2">{link.label}</p>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default BottomBar;

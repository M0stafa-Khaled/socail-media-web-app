import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { ISidebarLink } from "@/interfaces";
import { useLogOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const LeftSideBar = () => {
  const { user } = useUserContext();
  const { mutate: logOutHandler, isSuccess } = useLogOutAccount();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess, navigate]);

  return (
    <aside className="leftsidebar">
      <nav className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile"
            className="rounded-full h-10 w-10"
          />
          <div className="flex flex-col">
            <p className="body-bold capitalize">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: ISidebarLink) => {
            const isActive = link.route === pathname;
            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant={"ghost"} className="shad-button_ghost">
            <img src="/assets/icons/logout.svg" alt="logout" />
            <span className="small-medium lg:base-medium">Logout</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure to logout?</AlertDialogTitle>
            <AlertDialogDescription>
              When you log out, you will not be able to access your account
              information until after you log in again
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red"
              onClick={() => {
                logOutHandler();
              }}
            >
              LogOut
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </aside>
  );
};

export default LeftSideBar;

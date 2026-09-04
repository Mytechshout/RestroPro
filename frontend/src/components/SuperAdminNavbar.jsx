import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import {
  IconArmchair2,
  IconBuildingStore,
  IconChartArea,
  IconChefHat,
  IconChevronLeft,
  IconChevronRight,
  IconDeviceIpadHorizontal,
  IconFileInvoice,
  IconFriends,
  IconLayoutDashboard,
  IconSettings2,
  IconToolsKitchen3,
  IconUsersGroup,
  IconX,
} from "@tabler/icons-react";
import { clsx } from "clsx";
import AppLogo from "./AppLogo";
import AvatarImg from "../assets/avatar.svg";
import { iconStroke } from "../config/config";
import { getUserDetailsInLocalStorage } from "../helpers/UserDetails";
import { NavbarContext } from "../contexts/NavbarContext";
import { setNavbarCollapsed, toggleNavbar } from "../helpers/NavbarSettings";
import { useTheme } from "../contexts/ThemeContext";

export default function SuperAdminNavbar() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { pathname } = useLocation();
  const user = getUserDetailsInLocalStorage();
  
  const [isNavbarCollapsed, setIsNavbarCollapsed] = useContext(NavbarContext);

  const navbarItems = [
    {
      type: "link",
      text: t('superadmin_navbar.dashboard'),
      icon: <IconLayoutDashboard stroke={iconStroke} />,
      path: "/superadmin/dashboard/home",
    },
    {
      type: "link",
      text: t('superadmin_navbar.tenants'),
      icon: <IconBuildingStore stroke={iconStroke} />,
      path: "/superadmin/dashboard/tenants",
    },
    {
      type: "link",
      text: t('superadmin_navbar.reports'),
      icon: <IconChartArea stroke={iconStroke} />,
      path: "/superadmin/dashboard/reports",
    },
  ];

  const btnToggleNavbar = () => {
    const isNavCollapsed = toggleNavbar();
    console.log(isNavCollapsed);
    if (isNavCollapsed) {
      setIsNavbarCollapsed(true);
    } else {
      setIsNavbarCollapsed(false);
    }
  };
  const closeMobileNavbar = () => {
    if (window.innerWidth < 768) {
      setNavbarCollapsed(true);
      setIsNavbarCollapsed(true);
    }
  };
  useEffect(() => {
    if (isNavbarCollapsed || window.innerWidth >= 768) return;

    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event) => {
      if (event.key === "Escape") closeMobileNavbar();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isNavbarCollapsed]);
  if (isNavbarCollapsed) {
    return (
      <aside className="hidden md:flex z-40 w-[5.5rem] flex-col items-start gap-4 h-dvh px-5 py-6 overflow-y-auto fixed left-0 top-0 bg-restro-green-light">
        <AppLogo theme={theme} compact className="mb-6" />
        {navbarItems.map((item, index) => {
          if (item.type == "text") {
            return;
          }

          return (
            <Link
              key={index}
              className={clsx(
                              `w-12 h-12 flex items-center justify-center rounded-full transition`,
                              {
                                "bg-restro-bg-hover-dark-mode font-medium text-restro-green": theme === 'black' && pathname.includes(item.path),
                                "bg-restro-border-green-light font-medium text-restro-green": theme !== 'black' && pathname.includes(item.path),
                                "hover:bg-restro-bg-hover-dark-mode": theme === 'black' && !pathname.includes(item.path),
                                "hover:bg-restro-border-green-light": theme !== 'black' && !pathname.includes(item.path),
                              }
                            )}
              to={item.path}
              onClick={closeMobileNavbar}
            >
              {item.icon}
            </Link>
          );
        })}

        <button
          onClick={btnToggleNavbar}
          className="w-12 h-12 flex items-center justify-center rounded-full transition border border-restro-green-light hover:bg-restro-border-green text-restro-text"
        >
          <IconChevronRight stroke={iconStroke} />
        </button>
      </aside>
    );
  }

  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        onClick={closeMobileNavbar}
        className="fixed inset-0 z-40 bg-black/40 md:hidden"
      />
      <aside className='z-50 w-72 max-w-[86vw] flex flex-col items-start gap-2 md:gap-3 h-dvh px-5 py-6 overflow-x-hidden overflow-y-auto fixed left-0 top-0 border-r border-restro-border-green bg-restro-card-bg md:z-40'>
        <div className="mb-2 flex w-full items-start justify-between gap-3 md:mb-6">
          <AppLogo theme={theme} className="max-w-[176px] flex-1 md:h-14 md:max-w-[205px]" />
          <button
            type="button"
            aria-label="Close navigation"
            onClick={closeMobileNavbar}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-restro-border-green md:hidden"
          >
            <IconX stroke={iconStroke} size={20} />
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2 w-full md:mb-6">
          <img
            src={AvatarImg}
            alt="avatar"
            className="md:w-12 md:h-12 rounded-full block"
          />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-xs text-gray-500">
              {new String(user.role).toUpperCase()}
              {user.designation && <span>, {user.designation}</span>}
            </p>
          </div>
        </div>

        {navbarItems.map((item, index) => {
          if (item.type == "text") {
            return (
              <p key={index} className="font-bold hidden md:block">
                {item.text}
              </p>
            );
          }

          return (
            <Link
              key={index}
              className={clsx(
                "flex h-12 w-full items-center justify-start gap-3 rounded-full px-3 py-3 transition md:px-4",
                {
                                "bg-restro-bg-hover-dark-mode font-medium text-restro-green": theme === 'black' && pathname.includes(item.path),
                                "bg-restro-border-green-light font-medium text-restro-green": theme !== 'black' && pathname.includes(item.path),
                                "hover:bg-restro-bg-hover-dark-mode": theme === 'black' && !pathname.includes(item.path),
                                "hover:bg-restro-border-green-light": theme !== 'black' && !pathname.includes(item.path),
                              }
              )}
              to={item.path}
              onClick={closeMobileNavbar}
            >
              {item.icon} <p className="min-w-0 truncate">{item.text}</p>
            </Link>
          );
        })}
      </aside>

      <button
              onClick={btnToggleNavbar}
              type="button"
              aria-label="Collapse navigation"
              className="w-9 h-9 hidden md:flex items-center justify-center rounded-full border transition bg-restro-green-light dark:bg-restro-gray hover:bg-gray-200 dark:hover:bg-restro-button-hover text-gray-500 fixed bottom-4 left-72 -translate-x-1/2 z-[60] shadow-sm dark:border-restro-border-green"
            >
              <IconChevronLeft stroke={iconStroke} size={18} />
            </button>
    </>
  );
}

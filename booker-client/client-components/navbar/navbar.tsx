"use client";

import { usePathname } from "next/navigation";
import "./navbar.styles.scss";
import cn from "classnames";

export default function Navbar() {
  const pathname = usePathname();

  const isAuthPage =
    pathname.includes("sign-in") || pathname.includes("sign-up");

  if (isAuthPage) {
    return null;
  }

  return (
    <nav className="navbar">
      <ul>
        <li
          className={cn("navbar__item", { active: pathname.includes("clubs") })}
        >
          <a href="/clubs">Clubs</a>
        </li>
        <li
          className={cn("navbar__item", {
            active: pathname.includes("groups"),
          })}
        >
          <a href="/groups">Groups</a>
        </li>
        <li
          className={cn("navbar__item", {
            active: pathname.includes("trainers"),
          })}
        >
          <a href="/trainers">Trainers</a>
        </li>
        <li
          className={cn("navbar__item", {
            active: pathname.includes("trainings"),
          })}
        >
          <a href="/trainings">Trainings</a>
        </li>
      </ul>
    </nav>
  );
}

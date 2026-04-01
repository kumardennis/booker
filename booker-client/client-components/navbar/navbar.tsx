"use client";

import type { ReactElement } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "./navbar.styles.scss";
import cn from "classnames";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/clubs", label: "Clubs", match: "clubs" },
    { href: "/groups", label: "Groups", match: "groups" },
    // { href: "/trainers", label: "Trainers", match: "trainers" },
    { href: "/trainings", label: "Trainings", match: "trainings" },
  ];

  const isAuthPage =
    pathname.includes("sign-in") || pathname.includes("sign-up");

  if (isAuthPage) {
    return null;
  }

  const icons: Record<string, ReactElement> = {
    clubs: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    groups: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    trainings: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar__label">Navigate</div>
        <ul>
          {navItems.map((item) => (
            <li
              key={item.href}
              className={cn("navbar__item", {
                active: pathname.includes(item.match),
              })}
            >
              <Link href={item.href} className="navbar__link">
                {icons[item.match]}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <nav className="navbar-bottom">
        <ul>
          {navItems.map((item) => (
            <li
              key={item.href}
              className={cn("navbar__item", {
                active: pathname.includes(item.match),
              })}
            >
              <Link href={item.href} className="navbar__link">
                {icons[item.match]}
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}

"use client";

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

  return (
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
              <span className="navbar__dot" aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

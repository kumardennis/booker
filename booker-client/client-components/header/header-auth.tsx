"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { jetBrainsMono } from "@/app/fonts";

import "./header-auth.styles.scss";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/app/types";
import { SettingsIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUserProfileStore } from "@/stores/user-profile/user-profile";
import { signOutAction } from "@/app/actions";

export const AuthHeader = () => {
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();
  const [clubName, setClubName] = useState<string | null>(null);
  const [clubId, setClubId] = useState<string | null>(null);
  const clubNameCacheRef = useRef<Record<string, string | null>>({});

  const isPublicBrowseRoute =
    pathname.startsWith("/clubs") ||
    pathname.startsWith("/groups") ||
    pathname.startsWith("/trainings");

  const user = useUserProfileStore((state) => state.user);
  const userError = useUserProfileStore((state) => state.userError);
  const setUser = useUserProfileStore((state) => state.setUser);
  const setUserError = useUserProfileStore((state) => state.setUserError);

  const getUser = async () => {
    const { data: authData } = await supabase.auth.getUser();

    if (pathname === "/") {
      router.push("/clubs");

      return;
    }

    if (!authData.user) {
      if (
        pathname !== "/sign-in" &&
        pathname !== "/error" &&
        !isPublicBrowseRoute
      ) {
        router.push("/sign-in");
      }

      return;
    }

    const { data, error }: { data: User | null; error: any } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", authData.user?.id)
      .single();

    if (error || !data) {
      setUserError(error);
    }

    data && setUser(data);
  };

  const getClubName = async (clubId: string) => {
    if (clubNameCacheRef.current[clubId] !== undefined) {
      setClubName(clubNameCacheRef.current[clubId]);
      return;
    }

    try {
      const response = await fetch("/clubs/api/get-clubs");
      const dataJSON = await response.json();
      const clubs = dataJSON.data ?? [];

      const selectedClub = clubs.find(
        (club: { id: number; name: string }) => String(club.id) === clubId,
      );

      const nextClubName = selectedClub?.name ?? null;
      clubNameCacheRef.current[clubId] = nextClubName;
      setClubName(nextClubName);
    } catch {
      clubNameCacheRef.current[clubId] = null;
      setClubName(null);
    }
  };

  const signOut = async (e: React.MouseEvent) => {
    e.preventDefault();

    try {
      setUser(null);
      console.log("User state cleared");

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Error signing out:", error);
        return;
      }

      await signOutAction();
      router.push("/sign-in");
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  useEffect(() => {
    if (pathname !== "/sign-in" && !user) {
      getUser();
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN") {
          getUser();
        } else if (event === "SIGNED_OUT") {
          console.log("User signed out - clearing state");
          setUser(null);
        }
      },
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [pathname]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    setClubId(params.get("club_id"));
  }, [pathname]);

  useEffect(() => {
    if (!clubId) {
      setClubName(null);
      return;
    }

    getClubName(clubId);
  }, [clubId]);

  const headerCenterText = user?.first_name
    ? `Hi, ${user.first_name}`
    : (clubName ?? "Welcome!");

  return (
    <div className="header-auth flex items-center w-full justify-between">
      <span className={`${jetBrainsMono.className}`}>BOOKER</span>
      {!userError && !pathname.includes("sign-in") && (
        <span>{headerCenterText}</span>
      )}
      <div className="right-side-header-content flex items-center gap-4">
        <Link
          href={!user ? "/sign-in" : "/profile"}
          className="settings-icon-wrapper"
        >
          <SettingsIcon />
        </Link>
        <Link
          onClick={signOut}
          href={"/sign-in"}
          className={`${jetBrainsMono.className}`}
        >
          {!user ? "Sign in" : "Sign out"}
        </Link>
      </div>
    </div>
  );
};

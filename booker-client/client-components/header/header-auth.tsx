"use client";

import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { jetBrainsMono } from "@/app/fonts";

import "./header-auth.styles.scss";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@/app/types";
import { SettingsIcon } from "lucide-react";
import { useEffect } from "react";
import { useUserProfileStore } from "@/stores/user-profile/user-profile";
import { signOutAction } from "@/app/actions";

export const AuthHeader = () => {
  const supabase = createClient();
  const pathname = usePathname();
  const router = useRouter();

  const user = useUserProfileStore((state) => state.user);
  const userError = useUserProfileStore((state) => state.userError);
  const setUser = useUserProfileStore((state) => state.setUser);
  const setUserError = useUserProfileStore((state) => state.setUserError);

  const getUser = async () => {
    const { data: authData } = await supabase.auth.getUser();

    const { data, error }: { data: User | null; error: any } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", authData.user?.id)
      .single();

    if (error || !data) {
      setUserError(error);
    }

    if (!authData.user && pathname !== "/sign-in" && pathname !== "/error") {
      router.push("/sign-in");
    }

    data && setUser(data);
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
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [pathname]);

  return (
    <div className="header-auth flex items-center w-full justify-between">
      <span className={`${jetBrainsMono.className}`}>BOOKER</span>
      {!userError && !pathname.includes("sign-in") && (
        <span>Hi, {user?.first_name}!</span>
      )}
      <div className="right-side-header-content flex items-center gap-4">
        <Link href={"/profile"} className="settings-icon-wrapper">
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

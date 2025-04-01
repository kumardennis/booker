import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { jetBrainsMono } from "@/app/fonts";

import "./header-auth.styles.scss";

export default async function AuthHeader() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="header-auth flex items-center w-full justify-between">
      <span className={`${jetBrainsMono.className}`}>BOOKER</span>
      <span className={`${jetBrainsMono.className}`}>Sign in</span>
    </div>
  );
}

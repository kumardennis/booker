import { createClient } from "@/utils/supabase/server";
import { signin, signup } from "./actions";
import { signOutAction } from "@/app/actions";
import "../auth.styles.scss";

export default async function LoginPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await signOutAction();
  }

  return (
    <form className="sign-in-form auth-form">
      <div>
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input id="password" name="password" type="password" required />
      </div>
      <button className="btn-sign-in" formAction={signin}>
        Sign in
      </button>
      <button className="btn-sign-up" formAction={signup}>
        Create account
      </button>
    </form>
  );
}

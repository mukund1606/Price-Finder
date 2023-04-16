import { useSession, signIn, signOut } from "next-auth/react";

export default function Component({ className }) {
  const { data: session } = useSession();

  return (
    <>
      <button
        onClick={() => {
          session ? signOut() : signIn();
        }}
        className={
          "p-[2px] px-[4px] text-sm transition-all duration-300 ease-in border border-black rounded-lg hover:bg-black hover:text-white " +
          className
        }
      >
        {session ? "Sign Out" : "Sign In"}
      </button>
    </>
  );
}

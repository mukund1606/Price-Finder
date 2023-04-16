import LoginBtn from "@/components/login-btn";
import MainPage from "@/components/mainpage";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function HomePage() {
  const { data: session } = useSession();
  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-screen gap-2">
        <h1 className="text-3xl font-bold uppercase">Login To Continue</h1>
        <LoginBtn className="px-5 py-2" />
      </div>
    );
  } else {
    return (
      <div className="flex flex-col gap-2 p-6">
        <div className="text-center">
          <Image
            src="/favicon.ico"
            alt="Triveni Trading Co."
            className="absolute w-8 h-8 top-5 left-5"
            width={200}
            height={200}
          />
          <h1 className="p-2 text-3xl font-bold">Price Finder</h1>
          <h1 className="p-2 pb-5 text-xl font-semibold">
            TRIVENI TRADING CO.
          </h1>
        </div>
        <div className="absolute top-5 right-5">
          <LoginBtn />
        </div>
        <div>
          <MainPage />
        </div>
      </div>
    );
  }
}

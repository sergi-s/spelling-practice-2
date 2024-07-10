import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
import { Nav } from "./components/Nav";
import SpellingFreePage from "./FreeSpelling";
import AuthedSpelling from "./spelling/LoggedInSpelling";

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Nav session={session} />
      <div className="">
        {session ? <AuthedSpelling /> : <SpellingFreePage />}
      </div>
    </main>
  );
}

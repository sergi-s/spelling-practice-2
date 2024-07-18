import { Nav } from "./components/Nav";
import { getServerAuthSession } from "~/server/auth"
import SpellingFreePage from "./FreeSpelling";
// import Spelling from "./spelling";
import AuthedSpelling from "./spelling/LoggedInSpelling";

export default async function HomePage() {
  const session = await getServerAuthSession()
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Nav />
      <div className="">

        {session ? <AuthedSpelling /> : <SpellingFreePage />}
      </div>
    </main>
  );
}

import { getServerSession } from "next-auth";
import { Nav } from "./components/Nav";
import { authOptions } from "~/server/auth"
import SpellingFreePage from "./FreeSpelling/freeindex";
import Spelling from "./spelling";

export default async function HomePage() {
  const session = await getServerSession(authOptions)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Nav />
      <div className="">

        {session ? <Spelling /> : <SpellingFreePage />}
      </div>
    </main>
  );
}

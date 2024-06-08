// "use client"
import { Nav } from "./components/Nav";
// import { Spelling } from "~/app/spelling";
import SpellingFreePage from "./FreeSpelling/Spelling";

export default function HomePage() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Nav />
      <div className="">
        <SpellingFreePage />
      </div>
    </main>
  );
}

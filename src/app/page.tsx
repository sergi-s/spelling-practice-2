"use client"
import { Spelling } from "~/app/spelling";
import { Nav } from "./components/Nav";

export default function HomePage() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Nav />
      <div className="">
        <Spelling />
      </div>
    </main>
  );
}

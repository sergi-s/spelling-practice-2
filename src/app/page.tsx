"use client"
import { Spelling } from "./spelling";

export default function HomePage() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="">
          <Spelling/>
      </div>
    </main>
  );
}

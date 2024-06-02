import { Nav } from "./components/Nav";
import { Spelling } from "./spelling";

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

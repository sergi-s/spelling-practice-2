import { getServerSession } from "next-auth"
import Link from "next/link"
import { authOptions } from "~/server/auth"
export const Nav = async () => {
    const session = await getServerSession(authOptions)
    return (
        <header className="bg-gray-600 text-gray-100">
            <nav className="flex justify-between items-center w-full px-10 py-4">
                <div>My site</div>
                <div className="flex gap-10">
                    <Link href="/">Home</Link>
                    {session ? <Link href="/api/auth/signout?callbackUrl=/">signout</Link> :
                        <Link href="/api/auth/signin">LogIn</Link>}
                </div>
            </nav>
        </header>
    )
}
import { getServerSession } from "next-auth"
import Link from "next/link"
import { authOptions } from "~/server/auth"

export const Nav = async () => {
    const session = await getServerSession(authOptions);

    return (
        <header className="fixed top-0 left-0 right-0 z-10"
                style={{
                    background: 'linear-gradient(to right, #6a11cb, #2575fc)', // Example gradient
                    color: '#fff', // Ensuring text color is white for better visibility
                    width: '100%',
                    height: '60px', // Set a fixed height for the navbar
                    display: 'flex',
                    alignItems: 'center', // Aligns items vertically in the center
                    justifyContent: 'flex-end', // Aligns navigation links to the right
                    padding: '0 20px', // Padding on both sides
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' // Optional: adds shadow for depth
                }}>
            <nav className="w-full max-w-screen-xl mx-auto flex justify-between items-center">
                <div>LexIA</div>
                <div>
                    <Link 
                        href={session ? "/api/auth/signout?callbackUrl=/" : "/api/auth/signin"}
                        className="px-4 py-2 rounded hover:bg-opacity-80 transition-colors"
                        style={{
                            backgroundColor: session ? 'rgba(255, 82, 82, 0.8)' : 'rgba(82, 132, 255, 0.8)', // Redish for signout, bluish for signin
                            cursor: 'pointer',
                        }}
                    >
                        {session ? 'Sign Out' : 'Log In'}
                    </Link>
                </div>
            </nav>
        </header>
    )
}

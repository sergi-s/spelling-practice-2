"use client"
import { signOut, useSession } from "next-auth/react"
export const Nav = () => {
    const { status, data } = useSession()
    const user = data?.user
    const loggedIn = status === "authenticated"

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
                    {loggedIn ? (
                        <>
                            <li>Welcome, {user!.name}</li>
                            <li>
                                <a onClick={async () => { await signOut({ redirect: false }); }} style={{ cursor: 'pointer' }}>
                                    Sign out
                                </a>
                            </li>
                        </>

                    ) : (
                        <li>
                            <a href="/api/auth/signin">Sign in</a>
                        </li>

                    )}
                </div>
            </nav>
        </header>
    )
}

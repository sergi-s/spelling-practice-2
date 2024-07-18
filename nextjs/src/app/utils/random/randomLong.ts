export function generateRandomLong(): number {
    const MAX_INT32 = 0xFFFFFFFF;
    const MAX_INT32_DIV_100 = MAX_INT32 / 100;

    // Generate two random 32-bit integers and combine them to form a 64-bit integer
    const high = Math.floor(Math.random() * MAX_INT32);
    const low = Math.floor(Math.random() * MAX_INT32);
    const randomLong = (high * MAX_INT32_DIV_100 + low) % Number.MAX_SAFE_INTEGER;

    return randomLong;
}
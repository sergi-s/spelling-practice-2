
export const ShortcutInstructions = () => {
    return (
        <div className="flex m-2 p-2 border-double border-4 border-cyan-500 rounded shadow">
            <h2 className="text-lg font-bold mb-2">Shortcut Instructions:</h2>
            <ul className="list-disc pl-6">
                <li>Press <strong>1</strong> to speak the generated sentence.</li>
                <li>Press <strong>2</strong> to fetch a new sentence.</li>
            </ul>
        </div>
    );
};

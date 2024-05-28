// eslint-disable-next-line @typescript-eslint/ban-types
const IconButton = ({ onClick, color, children, id }: { onClick: Function, color: string, children: React.ReactNode, id?: string }) => {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <button id={id} onClick={handleClick} className="bg-blue-400 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full border-2 border-cyan-600 transition duration-300 ease-in-out flex items-center space-x-2 justify-center">
            {children}
        </button>
    );
};

export default IconButton;

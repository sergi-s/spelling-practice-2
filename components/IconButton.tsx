
const IconButton = ({ onClick, color, children, id }: { onClick: Function, color: string, children: React.ReactNode, id?: string }) => {
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <button id={id} onClick={handleClick} className={`bg-${color}-500 hover:bg-${color}-600 text-white font-bold py-2 px-4 rounded-full border-2 border-${color}-500 transition duration-300 ease-in-out flex items-center space-x-2`}>
            {children}
        </button>
    );
};

export default IconButton;

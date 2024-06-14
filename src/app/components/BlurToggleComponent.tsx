import { useState } from "react";

const styles = {
    tag: {
        display: 'inline-block',
        margin: '5px',
        padding: '5px 10px',
        borderRadius: '20px',
        backgroundColor: '#e0e0e0',
        color: '#000',
    },
    blurred: {
        filter: 'blur(5px)',
    },
    clear: {
        filter: 'none',
    },
};

export const BlurToggleComponent = ({ words }: { words: string[] }) => {
    const [isBlurred, setIsBlurred] = useState(true);

    const handleToggle = () => {
        setIsBlurred(!isBlurred);
    };

    return (
        <div>
            <div>
                {words.map((word, index) => (
                    <span
                        key={index}
                        style={{
                            ...styles.tag,
                            ...(!isBlurred ? styles.clear : styles.blurred),
                        }}
                    >
                        {word}
                    </span>
                ))}
            </div>
            <div>
                <label>
                    <input type="checkbox" checked={!isBlurred} onChange={handleToggle} />
                    Toggle Clear
                </label>
            </div>
        </div>
    );
};
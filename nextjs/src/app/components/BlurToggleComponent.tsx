import { useState } from "react";

const styles = {
    tag: {
        display: 'inline-block',
        margin: '5px',
        padding: '5px 10px',
        borderRadius: '20px',
        backgroundColor: '#e0e0e0',
        color: '#000',
        cursor: 'pointer', // Makes it clear that the tags are interactable
    },
    blurred: {
        filter: 'blur(5px)',
    },
    clear: {
        filter: 'none',
    },
    toggleContainer: {
        marginTop: '10px',
        fontFamily: '"Arial", sans-serif',
        fontSize: '16px',
    },
    checkbox: {
        marginRight: '5px',
        cursor: 'pointer', // Indicates that the checkbox is clickable
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
                        onClick={handleToggle} // Allows toggling by clicking on the words too
                    >
                        {word}
                    </span>
                ))}
            </div>
            <div style={styles.toggleContainer}>
                <label>
                    <input
                        type="checkbox"
                        style={styles.checkbox}
                        checked={!isBlurred}
                        onChange={handleToggle}
                    />
                    {isBlurred ? 'Un-blur Incorrect Words' : 'Blur Incorrect Words'}
                </label>
            </div>
        </div>
    );
};

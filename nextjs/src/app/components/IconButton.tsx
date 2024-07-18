import React, { forwardRef } from 'react';
import styles from './IconButton.module.css';

type IconButtonProps = {
  onClick: () => void;
  color: "gradient1" | "gradient2";
  children: React.ReactNode;
  id?: string;
};

// eslint-disable-next-line react/display-name
const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ onClick, color, children, id }, ref) => {
    const buttonClass = color === 'gradient1' ? styles.gradientButton1 : styles.gradientButton2;

    return (
      <button
        ref={ref}
        id={id}
        onClick={onClick}
        className={`${styles.button} ${buttonClass} text-white font-bold py-2 px-4 rounded-full flex items-center space-x-2 justify-center`}
      >
        {children}
      </button>
    );
  }
);

export default IconButton;

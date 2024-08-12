import { useEffect, useState } from 'react';
export const LoadingIndicator: React.FC = () => {
    const [dots, setDots] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setDots((prevDots) => (prevDots + 1) % 4); // Cycle through 0, 1, 2, 3
        }, 500); // Update every 500 milliseconds

        return () => clearInterval(intervalId); // Clean up the interval on component unmount
    }, []);

    return (
        <div
            style={{
                height: '100vh',
                width: '100vw',
                padding: '2rem',
                maxWidth: '1536px',
                marginLeft: 'auto',
                marginRight: 'auto',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ffbd5d'
            }}
        >
            <div
                style={{
                    fontSize: '4rem',
                    /* 6xl */
                    fontWeight: '800',
                    /* extrabold */
                    lineHeight: '1.25',
                    /* snug */
                    color: '#FFDEAD',
                    /* cyan-200 */
                }}
            >
                Loading{'.'.repeat(dots)}
            </div>
        </div >
    )
};
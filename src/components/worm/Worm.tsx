import { useEffect, useState } from 'react';
interface WormProps {
  screenSize: [number, number];
  position: [number, number];
}
const CURSOR_PADDING = 10;
function Worm({ screenSize, position }: WormProps) {
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);

  const [viewBoxSizeString, setViewBoxSizeString] = useState('0 0 1024 1080');

  useEffect(() => {
    setViewBoxSizeString(
      `${position[0]} ${position[1]} ${screenSize[0]} ${screenSize[1]}`,
    );
  }, [screenSize, position]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setX(getX(screenSize[0], position[0], event.clientX));
      setY(getY(screenSize[0], position[1], event.clientY));
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [screenSize, position]);

  return (
    <div className='worm'>
      <svg
        viewBox={viewBoxSizeString}
        xmlns='http://www.w3.org/2000/svg'
      >
        <circle
          cx={x}
          cy={y}
          r='5'
          fill='red'
        />
      </svg>
    </div>
  );
}

export default Worm;

function getX(fieldWidth: number, startField: number, clientX: number): number {
  const endField = startField + fieldWidth;
  const x = clientX - CURSOR_PADDING;
  const xInField = x > endField ? endField : x < startField ? startField : x;
  return xInField;
}

function getY(
  fieldHeight: number,
  startField: number,
  clientY: number,
): number {
  const endField = startField + fieldHeight;
  const y = clientY - CURSOR_PADDING;
  const yInField = y > endField ? endField : y < startField ? startField : y;
  return yInField;
}

import { useEffect, useRef, useState, type ReactNode } from 'react';
import './Field.css';
import type { Point } from '../worm/Point';
const CURSOR_PADDING = {
  x: -40,
  y: 100,
};

interface FieldProps {
  children: (args: {
    fieldSize: [number, number];
    fieldPosition: [number, number];
    cursorPosition: Point;
  }) => ReactNode;
  changeCursorPosition: (position: Point) => void;
}

function Field({ children, changeCursorPosition }: FieldProps) {
  const [size, setSize] = useState([1024, 1080]);
  const [cursorPosition, setCursorPosition] = useState({ x: 600, y: 700 });

  const position = useRef<[number, number]>([0, 0]);
  const marginLeft = useRef<number>(0);
  const marginTop = useRef<number>(0);

  useEffect(() => {
    const handleWindowSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      console.log(`Window size: ${width}, ${height}`);
      marginLeft.current = width / 15;
      marginTop.current = height / 10;
      position.current = [marginLeft.current, marginTop.current];
      setSize([width - marginLeft.current * 2, (height * 8) / 10]);
    };
    handleWindowSize();
    window.addEventListener('resize', handleWindowSize);

    return () => {
      window.removeEventListener('resize', handleWindowSize);
    };
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const localX = getX(size[0], marginLeft.current, event.clientX);
      const localY = getY(size[1], marginTop.current, event.clientY);

      setCursorPosition((prev) =>
        prev.x !== localX || prev.y !== localY
          ? { x: localX, y: localY }
          : prev,
      );
      changeCursorPosition({ x: localX, y: localY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [size[0], size[1], marginLeft, marginTop]);

  return (
    <div
      className='field'
      style={{
        width: size[0],
        height: size[1],
        marginTop: marginTop.current,
        marginLeft: marginLeft.current,
      }}
    >
      {children({
        fieldSize: [size[0], size[1]],
        fieldPosition: position.current,
        cursorPosition,
      })}
    </div>
  );
}

function getX(fieldWidth: number, startField: number, clientX: number): number {
  const endField = startField + fieldWidth;
  const x = clientX + CURSOR_PADDING.x;
  const xInField =
    x > endField ? endField : x <= startField ? startField + 2 : x;
  return xInField;
}

function getY(
  fieldHeight: number,
  startField: number,
  clientY: number,
): number {
  const endField = startField + fieldHeight;
  const y = clientY - CURSOR_PADDING.y;
  const yInField =
    y > endField ? endField : y <= startField ? startField + 3 : y;
  return yInField;
}

export default Field;

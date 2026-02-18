import { useEffect, useState, useRef } from 'react';
import './Worm.css';

interface WormProps {
  fieldSize: [number, number];
  fieldPosition: [number, number];
}

const CURSOR_PADDING = 10;
const SMOOTHING = 0.045;

function Worm({ fieldSize, fieldPosition }: WormProps) {
  const [wormIsVisible, setWormIsVisible] = useState(false);
  const [current, setCurrent] = useState({ x: 50, y: 50 });

  const [viewBoxSizeString, setViewBoxSizeString] = useState('0 0 1024 1080');

  // Флаг: было ли уже движение мыши?
  const hasMoved = useRef(false);
  const currentRef = useRef({ x: 50, y: 50 });
  const targetRef = useRef({ x: 50, y: 50 });
  const animationID = useRef<number>(null);

  // эффект на изменение размера окна
  useEffect(() => {
    setViewBoxSizeString(
      `${fieldPosition[0]} ${fieldPosition[1]} ${fieldSize[0]} ${fieldSize[1]}`,
    );
  }, [fieldSize, fieldPosition]);

  // эффект перемещения курсора
  useEffect(() => {
    const animate = () => {
      const curr = currentRef.current;
      const targ = targetRef.current;
      if (!hasMoved.current) {
        animationID.current = requestAnimationFrame(animate);
        return;
      }
      curr.x += (targ.x - curr.x) * SMOOTHING;
      curr.y += (targ.y - curr.y) * SMOOTHING;

      setCurrent({ x: curr.x, y: curr.y });
      animationID.current = requestAnimationFrame(animate);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const newX = getX(fieldSize[0], fieldPosition[0], event.clientX);
      const newY = getY(fieldSize[1], fieldPosition[1], event.clientY);

      const newTarget = { x: newX, y: newY };
      targetRef.current = newTarget;

      // при первом mouseMove перемещаем точку к курсору
      if (!hasMoved.current) {
        hasMoved.current = true;
        setWormIsVisible(true);

        currentRef.current = { ...newTarget };
        setCurrent({ ...newTarget });
        return;
      }
    };
    animationID.current = requestAnimationFrame(animate);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationID.current) {
        cancelAnimationFrame(animationID.current);
      }
    };
  }, [fieldSize, fieldPosition]);

  return (
    <div className='worm'>
      <svg
        viewBox={viewBoxSizeString}
        xmlns='http://www.w3.org/2000/svg'
        style={{ overflow: 'auto' }}
      >
        {wormIsVisible ? (
          <circle
            cx={current.x}
            cy={current.y}
            r='10'
            fill='red'
            className='worm-dot'
          />
        ) : (
          <></>
        )}
        <circle
          cx={500}
          cy={500}
          r='10'
          fill='red'
          className='worm-dot'
        />
        <circle
          cx={500}
          cy={505}
          r='10'
          fill='red'
          className='worm-dot'
        />
        <circle
          cx={500}
          cy={510}
          r='10'
          fill='red'
          className='worm-dot'
        />
      </svg>
    </div>
  );
}

export default Worm;

function getX(fieldWidth: number, startField: number, clientX: number): number {
  const endField = startField + fieldWidth;
  const x = clientX - CURSOR_PADDING;
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
  const y = clientY - CURSOR_PADDING;
  const yInField =
    y > endField ? endField : y <= startField ? startField + 3 : y;
  return yInField;
}

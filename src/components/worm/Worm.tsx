import { useEffect, useState, useRef } from 'react';
import './Worm.css';
import Segment from '../circle/Segment';

interface SegmentWorm {
  current: Point;
  prev: SegmentWorm | null;
}
interface WormProps {
  fieldSize: [number, number];
  fieldPosition: [number, number];
}
interface Point {
  x: number;
  y: number;
}
const INITIAL: SegmentWorm = {
  current: { x: 600, y: 600 },
  prev: {
    current: { x: 610, y: 610 },
    prev: {
      current: { x: 620, y: 620 },
      prev: { current: { x: 630, y: 630 }, prev: null },
    },
  },
};
const CURSOR_PADDING = 10;
const HAS_ANIMATION = false;
const START_WORM_VISIBLE = true;
const MAX_SPEED = 6;

function Worm({ fieldSize, fieldPosition }: WormProps) {
  const [wormIsVisible, setWormIsVisible] = useState(START_WORM_VISIBLE);

  const [segment, setSegment] = useState<SegmentWorm>(INITIAL);

  const segmentRef = useRef<SegmentWorm>(segment);


  const [viewBoxSizeString, setViewBoxSizeString] = useState('0 0 1024 1080');

  const hasMoved = useRef(false);
  const targetRef = useRef({ x: 50, y: 50 });
  const animationID = useRef<number>(null);

  const updateWormPosition = () => {
    const currentHead = segmentRef.current.current;
    const target = targetRef.current;

    const dx = target.x - currentHead.x;
    const dy = target.y - currentHead.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    let nextHead: Point | null = null;

    if (distance > MAX_SPEED) {
      const ratio = MAX_SPEED / distance;
      nextHead = {
        x: currentHead.x + dx * ratio,
        y: currentHead.y + dy * ratio,
      };
    } else if (distance > 0.5) {
      // Финишный телепорт, чтобы не дрожал
      nextHead = target;
    }

    if (nextHead) {
      const nextSegment: SegmentWorm = shiftWorm(
        segmentRef.current,
        nextHead,
      ) as SegmentWorm;
      segmentRef.current = nextSegment;
      setSegment(nextSegment);
    }
  };

  useEffect(() => {
    const animate = () => {
      updateWormPosition();
      animationID.current = requestAnimationFrame(animate);
    };

    animationID.current = requestAnimationFrame(animate);
    const handleMouseMove = (event: MouseEvent) => {
      const targetX = getX(fieldSize[0], fieldPosition[0], event.clientX);
      const targetY = getY(fieldSize[1], fieldPosition[1], event.clientY);

      // Просто обновляем цель. Движение происходит в animate().
      targetRef.current = { x: targetX, y: targetY };

      if (!hasMoved.current) {
        hasMoved.current = true;
        setWormIsVisible(true);

        // При первом движении телепортируем, чтобы не ждать долго
        const initialSegment = createTeleportedBody(
          segmentRef.current,
          targetRef.current,
        );
        segmentRef.current = initialSegment;
        setSegment(initialSegment);
      }
    };

    if (HAS_ANIMATION) {
      animationID.current = requestAnimationFrame(animate);
    }
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationID.current) {
        cancelAnimationFrame(animationID.current);
      }
    };
  }, [fieldSize, fieldPosition]);

  useEffect(() => {
    setViewBoxSizeString(
      `${fieldPosition[0]} ${fieldPosition[1]} ${fieldSize[0]} ${fieldSize[1]}`,
    );
  }, [fieldSize, fieldPosition]);
  
  useEffect(() => {
    segmentRef.current = segment;
  }, [segment]);

  function feed() {
    const nextSegment = addTailFast(segmentRef.current);
    if (nextSegment) {
      segmentRef.current = nextSegment;
      setSegment(nextSegment);
    }
  }

  return (
    <>
      <button onClick={feed}>увеличить</button>
      <div className='worm'>
        <svg
          viewBox={viewBoxSizeString}
          xmlns='http://www.w3.org/2000/svg'
          style={{ overflow: 'auto' }}
        >
          {wormIsVisible ? (
            <Segment
              segment={segment}
              isHead={true}
            ></Segment>
          ) : (
            <></>
          )}
        </svg>
      </div>
    </>
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
function createTeleportedBody(
  oldBody: SegmentWorm | null,
  pos: Point,
): SegmentWorm {
  if (!oldBody) return { current: { ...pos }, prev: null };
  return {
    current: { ...pos },
    prev: createTeleportedBody(oldBody.prev, pos),
  };
}
function shiftWorm(
  body: SegmentWorm | null,
  newPoint: Point,
): SegmentWorm | null {
  if (!body) return null;

  const oldCurrent = body.current;

  return {
    current: { ...newPoint },
    prev: shiftWorm(body.prev, oldCurrent),
  };
}

function addTailFast(body: SegmentWorm ): SegmentWorm | null {
   // let old: SegmentWorm | null = { ...this };
    let preEnd: SegmentWorm = { current: body.current, prev: body.prev };
    while (!!preEnd?.prev?.prev) {
      preEnd = preEnd?.prev;
      // i = i.prev;
    }
    const preEndX = preEnd?.current.x as number;
    const endX = preEnd?.prev?.current.x as number;
    const preEndY = preEnd?.current.y as number;
    const endY = preEnd?.prev?.current.y as number;
    const point = { x: endX * 2 - preEndX, y: endY * 2 - preEndY };
    ((preEnd as SegmentWorm).prev as SegmentWorm).prev = {
      current: point,
      prev: null,
    };

    return { current: body.current, prev: body.prev };
}

import { useEffect, useState, useRef } from 'react';
import './Worm.css';
import Segment from '../circle/Segment';
import type { Point } from './Point';

interface SegmentWorm {
  current: Point;
  prev: SegmentWorm | null;
}
interface WormProps {
  fieldSize: [number, number];
  fieldPosition: [number, number];
  target: Point;
  feed: number;
}

const INITIAL_SEGMENTS = 3;
const SEGMENT_DISTANCE = 15;
const MAX_SPEED = 6;

function Worm({ fieldSize, fieldPosition, target, feed }: WormProps) {
  const [head, setHead] = useState<SegmentWorm | null>(() =>
    createInitialWorm(target),
  );

  const rafRef = useRef<number>(0);
  const targetRef = useRef<Point>(target);

  useEffect(() => {
    const animate = () => {
      setHead((prevHead) => {
        if (!prevHead) return null;

        const currentPos = prevHead.current;
        const targetPos = targetRef.current;

        const dx = targetPos.x - currentPos.x;
        const dy = targetPos.y - currentPos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        let newHeadPos: Point;

        if (distance > MAX_SPEED) {
          const ratio = MAX_SPEED / distance;
          newHeadPos = {
            x: currentPos.x + dx * ratio,
            y: currentPos.y + dy * ratio,
          };
        } else {
          newHeadPos = { x: targetPos.x, y: targetPos.y };
        }

        return shiftWorm(prevHead, newHeadPos);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    setHead((prevHead) => (prevHead ? addTail(prevHead) : null));
  }, [feed]);

  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  return (
    <>
      <div className='worm'>
        <svg
          viewBox={`${fieldPosition[0]} ${fieldPosition[1]} ${fieldSize[0]} ${fieldSize[1]}`}
          xmlns='http://www.w3.org/2000/svg'
          style={{ overflow: 'auto' }}
        >
          {head && (
            <Segment
              segment={head}
              isHead={true}
            />
          )}
        </svg>
      </div>
    </>
  );
}

export default Worm;

function shiftWorm(
  head: SegmentWorm | null,
  newPoint: Point,
): SegmentWorm | null {
  if (!head) return null;

  const oldCurrent = head.current;

  return {
    current: { ...newPoint },
    prev: shiftWorm(head.prev, oldCurrent),
  };
}

function addTail(head: SegmentWorm): SegmentWorm {
  function cloneWithTail(seg: SegmentWorm | null): SegmentWorm | null {
    if (!seg) return null;
    if (!seg.prev) {
      // Добавляем новый сегмент после последнего
      return {
        current: seg.current,
        prev: {
          current: {
            x: seg.current.x - SEGMENT_DISTANCE,
            y: seg.current.y,
          },
          prev: null,
        },
      };
    }
    return {
      current: seg.current,
      prev: cloneWithTail(seg.prev),
    };
  }
  return cloneWithTail(head)!;
}
function createInitialWorm(start: Point): SegmentWorm {
  let worm: SegmentWorm = { current: { ...start }, prev: null };
  for (let i = 1; i < INITIAL_SEGMENTS; i++) {
    worm = {
      current: {
        x: start.x - i * SEGMENT_DISTANCE,
        y: start.y,
      },
      prev: worm,
    };
  }
  return worm;
}

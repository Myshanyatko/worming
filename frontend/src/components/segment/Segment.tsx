import './Segment.css';

interface Segment {
  current: { x: number; y: number };
  prev: Segment | null;
}
interface SegmentProps {
  segment: Segment;
  isHead?: boolean;
}
function Segment({ segment, isHead }: SegmentProps) {
  const x = segment.current.x;
  const y = segment.current.y;

  return (
    <>
      {segment.prev ? <Segment segment={segment.prev}></Segment> : <></>}
      <circle
        cx={x}
        cy={y}
        r='10'
        fill='#fdb4ca'
        className='worm-dot'
      />
      {isHead ? (
        <>
          <circle
            cx={x - 4}
            cy={y -2}
            r='2'
            fill='black'
          />
          <circle
            cx={x + 4}
            cy={y - 2}
            r='2'
            fill='black'
          />
           <path
            d={`M ${x - 5} ${y + 2} Q ${x} ${y + 6} ${x + 5} ${y + 2}`}
            stroke="black"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default Segment;

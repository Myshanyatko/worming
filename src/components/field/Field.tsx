import { useEffect, useRef, useState, type ReactNode } from 'react';
import './Field.css';

interface FieldProps {
  children: (args: {size: [number, number], position: [number, number]}) => ReactNode;
}

function Field({ children }: FieldProps) {
  const [viewBoxSize, setViewBoxSize] = useState([1024, 1080]);
  const [position, setPosition] = useState<[number, number]>([0, 0]);

  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWindowSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      console.log(`Window size: ${width}, ${height}`);
      setViewBoxSize([width, height]);
    };
    window.addEventListener('resize', handleWindowSize);

    const rect = (fieldRef.current as HTMLDivElement).getBoundingClientRect();
    setPosition([rect.left, rect.top]);
    return () => {
      window.removeEventListener('resize', handleWindowSize);
    };
  }, []);

  return (
    <div
      ref={fieldRef}
      className='field'
      style={{
        width: viewBoxSize[0] - 100,
        height: viewBoxSize[1] / 1.5,
        marginTop: viewBoxSize[1] / 10,
      }}
    >
      {children({ size: [viewBoxSize[0] - 100, viewBoxSize[1] / 1.5], position})}
    </div>
  );
}

export default Field;

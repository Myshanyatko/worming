import { useEffect, useRef, useState, type ReactNode } from 'react';
import './Field.css';

interface FieldProps {
  children: (args: {
    size: [number, number];
    position: [number, number];
  }) => ReactNode;
}

function Field({ children }: FieldProps) {
  const [size, setSize] = useState([1024, 1080]);

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
        size: [size[0], size[1]],
        position: position.current,
      })}
    </div>
  );
}

export default Field;

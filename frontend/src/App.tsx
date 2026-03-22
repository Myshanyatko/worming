import { useState } from 'react';
import './App.css';
import Field from './components/field/Field';
import Worm from './components/worm/Worm';
import { useWebSocket } from './hooks/useWebSocket';
import type { Point } from './components/worm/Point';

export interface IWSMessage {
  name: string;
  position: Point;
}

function App() {
  const [name, setName] = useState('');
  const [rivalName, setRivalName] = useState('');
  const [rivalPosition, setRivalPosition] = useState<Point>({
    x: 600,
    y: 700,
  });

  const changeRivalPosition = (message: string | null) => {
    if (message) {
      const obj = JSON.parse(message) as IWSMessage;
      const position = obj.position;
      const name = obj.name;
      setRivalPosition(position);
      console.log('я получил координаты', position);
      if (!rivalName) {
        setRivalName(name);
      }
    }
  };

  const [countSegments, setCountSegments] = useState(1);
  const { send, connect, isConnect } = useWebSocket(
    'ws://localhost:8080',
    changeRivalPosition,
  );
  function feed() {
    setCountSegments((cur) => cur + 1);
  }

  function changeCursorPosition(position: Point) {
    isConnect && send(position);
  }

  return (
    <div className='app'>
      <div>
        <h3>Worms!</h3>
        {/* <button onClick={feed}>увеличить</button> */}
        <input
          onChange={(e) => setName(e.target.value)}
          title='Ваше имя'
        />
        <button onClick={() => connect(name)}>Начать игру</button>
      </div>
      <Field changeCursorPosition={changeCursorPosition}>
        {({ fieldSize, cursorPosition, fieldPosition }) => (
          <>
            {' '}
            {rivalName ? (
              <Worm
                fieldSize={fieldSize}
                target={rivalPosition}
                fieldPosition={fieldPosition}
                feed={countSegments}
                name={rivalName}
              ></Worm>
            ) : (
              <></>
            )}
            <Worm
              fieldSize={fieldSize}
              fieldPosition={fieldPosition}
              target={cursorPosition}
              feed={countSegments}
              name={name}
            ></Worm>
          </>
        )}
      </Field>
    </div>
  );
}

export default App;

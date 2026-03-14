import { useState } from 'react';
import './App.css';
import Field from './components/field/Field';
import Worm from './components/worm/Worm';

function App() {
  const [countSegments, setCountSegments] = useState(1);

  function feed() {
    setCountSegments((cur) => cur + 1);
  }

  return (
    <div className='app'>
      <button onClick={feed}>увеличить</button>
      <Field>
        {({ fieldSize, fieldPosition, cursorPosition }) => (
          <Worm
            fieldSize={fieldSize}
            fieldPosition={fieldPosition}
            target={cursorPosition}
            feed={countSegments}
          ></Worm>
        )}
      </Field>
    </div>
  );
}

export default App;

import './App.css';
import Field from './components/field/Field';
import Worm from './components/worm/Worm';

function App() {
  return (
    <div className='app'>
      <Field>{({ size, position }) => <Worm fieldSize={size} fieldPosition={position}></Worm>}</Field>
    </div>
  );
}

export default App;

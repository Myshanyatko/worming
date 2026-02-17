import './App.css';
import Field from './components/field/Field';
import Worm from './components/worm/Worm';

function App() {
  return (
    <div className='app'>
      <Field>{({ size, position }) => <Worm screenSize={size} position={position}></Worm>}</Field>
    </div>
  );
}

export default App;

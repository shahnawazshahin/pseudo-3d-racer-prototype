import './App.css';
import { Main } from './Main';

function App() {
  new Phaser.Game(config);

  return (<div id='app-container' className='App'></div>);
}

export default App;

const config = {
  type: Phaser.AUTO,
  parent: 'app-container',
  width: 1280,
  height: 720,
  scene: [ Main ]
}
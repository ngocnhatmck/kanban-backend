import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Board } from './components/Board';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.main}>
        <Header />
        <div className={styles.content}>
          <Board />
        </div>
      </div>
    </div>
  );
}

export default App;

import 'reset-css'
import './App.css';
import { Suspense } from 'react';
import { ThreeD } from './ThreeD';
import { Interface } from './Interface';
import { LoadingIndicator } from './loading';
function App() {

  return (
    <>
      <Suspense fallback={<LoadingIndicator />}>
        <Interface />
        <ThreeD />
      </Suspense>
    </>
  );
}

export default App;





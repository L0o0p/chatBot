import 'reset-css'
import './App.css';
import { Suspense } from 'react';
import { ThreeD } from './ThreeD';
import { Interface } from './Interface';
function App() {

  return (
    <>
      <Suspense fallback={<Loading />}>
        <Interface />
        <ThreeD />
      </Suspense>
    </>
  );
}

export default App;

const Loading = () => {
  console.log('loading')
  return (
    <img src={'loadingPage/logo.png'} alt="loading" />
  )
}



import React, { Suspense } from 'react';
import './App.css';
const App1 = React.lazy(()=>import("app1/main"));
const App2 = React.lazy(()=>import("app2/main"));
import Header from './components/Header';
function App() {
  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
    <Header></Header>
      <App1 />
      <App2 />
    </Suspense>
  </>
  );
}

export default App;

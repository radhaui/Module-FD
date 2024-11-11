import React, { Suspense } from 'react';
import './App.css';
const App1 = React.lazy(()=>import("app1/main"));
const App2 = React.lazy(()=>import("app2/main"));

function App() {
  return (
    <>
    <Suspense fallback={<div>Loading...</div>}>
    
      <App1 />
      <App2 />
    </Suspense>
  </>
  );
}

export default App;

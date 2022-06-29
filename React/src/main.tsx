import React, { useState } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// const CompChild = () => <div>test</div>
// const Comp = () => {
//   // const [value, setValue] = useState(false);
//   return <div>
//      <div>
//      <div>1
//   </div>
//   <div>1
//   <div>1
//   <div>
//     1
//   </div>
//   <CompChild />
//   </div>
//   </div>
//   </div>
//   </div>;
// }

// (window as any).memo = React.memo;
// (window as any).Comp = Comp;
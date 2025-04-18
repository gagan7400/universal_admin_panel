import './App.css'
import Login from './Login'
import Register from './Register'
import { Bounce, ToastContainer   } from 'react-toastify';
function App() {
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <Register />
      <Login />
    </>
  )
}

export default App

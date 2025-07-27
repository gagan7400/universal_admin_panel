import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../redux/actions/authActions';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  let navigate = useNavigate()
  const { message, error } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email, navigate));
  };
 

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300 flex items-center justify-center font-sans antialiased text-gray-900">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 sm:p-10 transition-all duration-300 ease-in-out">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-blue-800 mb-6 uppercase">Forgot Password</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-blue-800 text-sm font-semibold mb-1">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Username or Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition duration-300 uppercase"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>

    // <div className="antialiased bg-gray-200 text-gray-900 font-sans">
    //   <div className="flex items-center h-screen w-full">
    //     <div className="w-full bg-white rounded shadow-lg p-8 m-4 md:max-w-sm md:mx-auto">
    //       <span className="block w-full text-xl uppercase font-bold mb-4">Forgot Password</span>
    //       <form className="mb-4" onSubmit={handleSubmit}>
    //         <div className="mb-4 md:w-full">
    //           <label htmlFor="email" className="block text-xs mb-1">Email</label>
    //           <input className="w-full border rounded p-2 outline-none focus:shadow-outline" value={email} onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" placeholder="Username or Email" />
    //         </div>
    //         <button type='submit' className="bg-green-500 hover:bg-green-700 text-white uppercase text-sm font-semibold px-4 py-2 rounded">Send OTP</button>
    //       </form>
    //     </div>
    //   </div>
    // </div>
  );
};

export default ForgotPassword;

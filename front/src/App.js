import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { ProtectedRoute } from "./routes";

import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ActivateAcount from "./pages/ActivateAcount";
import HomePage from "./pages/HomePage";
import MovieForm from "./pages/MovieForm";
import Navbar from "./components/Navbar";


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Navbar />
      <Routes>
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/register' element={<RegisterPage/>} />
          <Route path='/activate-account' element={<ActivateAcount/>} />
          <Route element={<ProtectedRoute />}>
            <Route path='/' element={<HomePage/>} />
            <Route path='/movie-create' element={<MovieForm/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
   
  );
}

export default App;

import { Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar.tsx";
import ProductDetails from "./components/ProductDetails.tsx";
import Cart from "./components/Cart.tsx";
import Home from "./components/Home.tsx";
import {AuthProvider} from "./context/AuthContext.tsx";
import Login from "./components/Login.tsx";
import Register from "./components/Register.tsx";
import MyAccount from "./pages/MyAccount.tsx";

function App() {

    return (
        <>
            <AuthProvider>
            <Navbar />
            <Routes>
                <Route path="/products/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/" element= { <Home /> } />
                <Route path="/login" element={ <Login /> } />
                <Route path="/register" element= { <Register /> } />
                <Route path="/my-account" element={ <MyAccount /> }
                />
            </Routes>
            </AuthProvider>
        </>
    )
}

export default App;
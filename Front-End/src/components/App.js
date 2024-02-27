import { useState } from 'react';
import {connect} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavigationBar from './NavigationBar/NavigationBar';
import Footer from './Footer/Footer';
import HomePage from "./HomePage/HomePage";
import SignupPage from "./SignupPage/SignupPage";
import LoginPage from "./LoginPage/LoginPage";
import RestaurantPage from "./RestaurantPage/RestaurantPage";
import ProfilePage from "./ProfilePage/ProfilePage";
import Modal from './utils/Modal';
import Cart from './Cart/Cart';
import configs from '../configs';
import { redirect } from '../utils';
import {ToastContainer} from 'react-toastify';



const App = (props) => {

    const [showCart, setShowCart] = useState(false);

    if (localStorage.getItem(configs.jwt_token_name) === null && window.location.pathname !== '/login') {
        redirect("/login")
    }

    const getCartSize = () => {
        if(props.cart) {
            return props.cart.cartItems.length;
        }
    }


    const openCartModal = () => {
        setShowCart(true);
    }

    const renderCartContent = () => {
        return (
            <Cart type="everywhere"/>
        );
    }

    const closeCartModal = () => {
        setShowCart(false);
    }

    const renderCart = () => {
        if(showCart) {
            return <Modal close={closeCartModal} render={() => renderCartContent()} />;
        }
    }

    const renderNavigationBar = () => {
        const outsidePathnames = ['/login', '/signup']
        if (!outsidePathnames.includes(window.location.pathname)) {
            return <NavigationBar cartSize={getCartSize()} openCart={openCartModal} />
        }
    }

    return (
        <>
            {renderCart()}
            {renderNavigationBar()}
            <ToastContainer autoClose={configs.notification_length} />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage/>} />
                    <Route path="/signup" element={<SignupPage/>} />
                    <Route path="/login" element={<LoginPage/>} />
                    <Route path="/restaurants/:id" element={<RestaurantPage/>} />
                    <Route path="/profile" element={<ProfilePage/>} />
                </Routes>
            </BrowserRouter>
            <Footer />
        </>
    )

}

const mapStateToProps = (state) => {
    return {
        cart:state.cart,
    }
}

export default connect(mapStateToProps)(App);
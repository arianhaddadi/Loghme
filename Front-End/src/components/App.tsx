import React, { useState } from 'react';
import {connect} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavigationBar from './NavigationBar/NavigationBar.tsx';
import HomePage from "./HomePage/HomePage.tsx";
import SignupPage from "./SignupPage/SignupPage.tsx";
import LoginPage from "./LoginPage/LoginPage.tsx";
import RestaurantPage from "./RestaurantPage/RestaurantPage.tsx";
import ProfilePage from "./ProfilePage/ProfilePage.tsx";
import Modal from './utils/Modal.tsx';
import Cart from './Cart/Cart.tsx';
import configs from '../app/configs.ts';
import { redirect } from '../utils/redirect.ts';
import {ToastContainer} from 'react-toastify';
import { RootState } from '../app/store.ts';
import { CartState } from '../reducers/CartReducer.ts';

interface AppProps {
    cart: CartState
}

const App = (props: AppProps) => {

    const [showCart, setShowCart] = useState<boolean>(false);

    if (localStorage.getItem(configs.jwt_token_name) === null && window.location.pathname !== '/login') {
        redirect("/login")
    }

    const getCartSize = () => {
        if(props.cart) {
            return props.cart.cartItems.length;
        } else return 0;
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

    const renderFooter = () => {
        return (
            <footer className="copyright">
                {"\u00A9 All rights are reserved!"}
            </footer>
        )
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
            {renderFooter()}
        </>
    )

}

const mapStateToProps = (state: RootState) => {
    return {
        cart: state.cart,
    }
}

export default connect(mapStateToProps)(App);
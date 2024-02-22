import { useState } from 'react';
import {connect} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer/Footer';
import HomePage from "./HomePage/HomePage";
import SignupPage from "./SignupPage/SignupPage";
import LoginPage from "./LoginPage/LoginPage";
import RestaurantPage from "./RestaurantPage/RestaurantPage";
import ProfilePage from "./ProfilePage/ProfilePage";
import Modal from './utils/Modal';
import Cart from './Cart/Cart';
import CartFunctionsContext from '../contexts/CartFunctionsContext';
import configs from '../configs';



const App = (props) => {

    const [showCart, setShowCart] = useState(false);

    // componentDidMount = () => {
    //     browserHistory.listen(() => window.scroll({top:0}));
    // }

    if (localStorage.getItem(configs.jwt_token_name) === null && window.location.pathname !== '/login') {
        window.location.href = "/login";
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

    return (
        <>
            <CartFunctionsContext.Provider value={{getCartSize:getCartSize, openCart:openCartModal}}>
                {renderCart()}
                <BrowserRouter>
                    <Routes>
                        <Route path="/" exact element={<HomePage/>} />
                        <Route path="/signup" exact element={<SignupPage/>} />
                        <Route path="/login" exact element={<LoginPage/>} />
                        <Route path="/restaurants/:id" exact element={<RestaurantPage/>} />
                        <Route path="/profile" exact component={<ProfilePage/>} />
                    </Routes>
                </BrowserRouter>
                <Footer />
            </CartFunctionsContext.Provider>
        </>
    )

}

const mapStateToProps = (state) => {
    return {
        cart:state.cart,
    }
}

export default connect(mapStateToProps)(App);
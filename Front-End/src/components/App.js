import React from 'react';
import {connect} from "react-redux";
import {BrowserRouter, Route, Routes, useNavigate} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import Footer from './Footer/Footer';
import HomePage from "./HomePage/HomePage";
import SignupPage from "./SignupPage/SignupPage";
import LoginPage from "./LoginPage/LoginPage";
import RestaurantPage from "./RestaurantPage/RestaurantPage";
import ProfilePage from "./ProfilePage/ProfilePage";
import Modal from './utils/Modal';
import Cart from './Cart/Cart';
import {fetchAndStoreUserInfo, fetchAndStoreCart, fetchAndStoreFoodPartyInformation, storeGoogleAuthenticationObject, storeHistoryObject} from "../actions";
import CartFunctionsContext from '../contexts/CartFunctionsContext';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {cartIsOpen:false};
    }

    // componentDidMount = () => {
    //     browserHistory.listen(() => window.scroll({top:0}));
    // }

    componentWillMount() {
        const navigator = useNavigate();
        if (localStorage.getItem("loghmeUserToken") === null) {
            navigator("/login")
        }
    }

    getCartSize = () => {
        if(this.props.cart !== null) {
            return this.props.cart.cartItems.length;
        }
    }


    openCartModal = () => {
        this.setState({cartIsOpen:true});
    }

    renderCartContent = () => {
        return (
            <Cart type="everywhere"/>
        );
    }

    closeCartModal = () => {
        this.props.fetchAndStoreFoodPartyInformation();
        this.setState({cartIsOpen:false});
    }

    renderCart = () => {
        if(this.state.cartIsOpen) {
            return <Modal close={this.closeCartModal} render={() => this.renderCartContent()} />;
        }
    }

    render() {
        return (
            <>
                <CartFunctionsContext.Provider value={{getCartSize:this.getCartSize, openCart:this.openCartModal}}>
                    {this.renderCart()}
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
}

App.propTypes = {
    cart:PropTypes.object
}

const mapStateToProps = (state) => {
    return {
        cart:state.cart,
        googleAuthentication:state.googleAuthentication,
    }
}

export default connect(mapStateToProps, {fetchAndStoreUserInfo, fetchAndStoreCart, fetchAndStoreFoodPartyInformation, storeGoogleAuthenticationObject})(App);
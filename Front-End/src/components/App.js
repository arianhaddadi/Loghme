import React from 'react';
import {connect} from "react-redux";
import {Router, Route} from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import PropTypes from 'prop-types';
import Footer from './Footer/Footer';
import HomePage from "./HomePage/HomePage";
import SignupPage from "./SignupPage/SignupPage";
import LoginPage from "./LoginPage/LoginPage";
import RestaurantPage from "./RestaurantPage/RestaurantPage";
import ProfilePage from "./ProfilePage/ProfilePage";
import Modal from './Modal/Modal';
import Cart from './Cart/Cart';
import {fetchAndStoreUserInfo, fetchAndStoreCart, fetchAndStoreFoodPartyInformation, storeGoogleAuthenticationObject, storeHistoryObject} from "../actions";
import history from '../browserHistory/history';
import CartFunctionsContext from '../contexts/CartFunctionsContext';


class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {cartIsOpen:false};
    }

    componentDidMount = () => {
        history.listen(() => window.scroll({top:0}));
    }

    componentWillMount() {
        if (localStorage.getItem("loghmeUserToken") === null) {
            history.push("/login")
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

    storeHistoryObjectInReduxStore = () => {
        if (this.props.history === null) {
            this.props.storeHistoryObject(history);
        }
    }

    render() {
        return (
            <>
                <CartFunctionsContext.Provider value={{getCartSize:this.getCartSize, openCart:this.openCartModal}}>
                    {this.storeHistoryObjectInReduxStore()}
                    {this.renderCart()}
                    <Router history={history}>
                        <Route path="/" exact component={HomePage} />
                        <Route path="/signup" exact component={SignupPage} />
                        <Route path="/login" exact component={LoginPage} />
                        <Route path="/restaurants/:id" exact component={RestaurantPage} />
                        <Route path="/profile" exact component={ProfilePage} />
                    </Router>
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
        history:state.history
    }
}

export default connect(mapStateToProps, {fetchAndStoreUserInfo, fetchAndStoreCart, fetchAndStoreFoodPartyInformation, storeGoogleAuthenticationObject, storeHistoryObject})(App);
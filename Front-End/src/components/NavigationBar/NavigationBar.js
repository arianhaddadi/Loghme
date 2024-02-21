import React from 'react';
import PropTypes from 'prop-types';
import logo from '../../images/Logo.png';
import CartFunctionsContext from '../../contexts/CartFunctionsContext';
import {connect} from 'react-redux';
import {storeGoogleAuthenticationObject} from "../../actions";
import { redirect } from 'react-router-dom';


function NavigationBar(props) {
    const handleExit = () => {
        const googleAuthentication = props.googleAuthentication;
        if (googleAuthentication !== null && googleAuthentication.isSignedIn.get()) {
            googleAuthentication.signOut();
            googleAuthentication.disconnect();
        }
        localStorage.removeItem("loghmeUserToken");
        redirect("/login");
    };

    return (
        <CartFunctionsContext.Consumer>
            {(value) => {
                const numOfCartItems = value.getCartSize();
                return (
                    <div className="navigation-bar">
                        <div onClick={() => handleExit()} className={`exit ${props.hideExit ? "hide" : ""}`}>
                            Logout
                        </div>
                        <div onClick={() => redirect("/profile")} className={`profile ${props.hideProfile ? "hide" : ""}`}>
                            Profile
                        </div>
                        <i onClick={value.openCart} className="flaticon-smart-cart cart-logo"></i>
                        <div onClick={value.openCart} className={`cart-quantity ${numOfCartItems > 0 ? "isNotEmpty" : ""}`}>
                            {numOfCartItems > 0 ? numOfCartItems : ""}
                        </div>
                        <img onClick={() => redirect("/")} src={logo} className={`loghme-logo ${props.hideLogo ? "hide" : ""}`} alt="" />
                    </div>
                )
            }}
        </CartFunctionsContext.Consumer>  
    );
}

const mapStateToProps = (state) => {
    return {
        googleAuthentication:state.googleAuthentication
    }
}

NavigationBar.propTypes = {
    hideExit:PropTypes.bool,
    hideLogo:PropTypes.bool,
    hideProfile:PropTypes.bool,
}

export default connect(mapStateToProps, {storeGoogleAuthenticationObject})(NavigationBar);
import React from 'react';
import PropTypes from 'prop-types';
import logo from '../../images/Logo.png';
import CartFunctionsContext from '../../contexts/CartFunctionsContext';
import {connect} from 'react-redux';
import {storeGoogleAuthenticationObject} from "../../actions";

class NavigationBar extends React.Component {

    handleExit = () => {
        const googleAuthentication = this.props.googleAuthentication;
        if (googleAuthentication !== null && googleAuthentication.isSignedIn.get()) {
            googleAuthentication.signOut();
            googleAuthentication.disconnect();
        }
        localStorage.removeItem("loghmeUserToken");
        this.props.browserHistory.push("/login");
    }

    render() {
        return (
            <CartFunctionsContext.Consumer>
                {(value) => {
                    const numOfCartItems = value.getCartSize();
                    return (
                        <div className="navigation-bar">
                            <div onClick={() => this.handleExit()} className={`exit ${this.props.hideExit ? "hide" : ""}`}>
                                Logout
                            </div>
                            <div onClick={() => this.props.browserHistory.push("/profile")} className={`profile ${this.props.hideProfile ? "hide" : ""}`}>
                                Profile
                            </div>
                            <i onClick={value.openCart} className="flaticon-smart-cart cart-logo"></i>
                            <div onClick={value.openCart} className={`cart-quantity ${numOfCartItems > 0 ? "isNotEmpty" : ""}`}>
                                {numOfCartItems > 0 ? numOfCartItems : ""}
                            </div>
                            <img onClick={() => this.props.browserHistory.push("/")} src={logo} className={`loghme-logo ${this.props.hideLogo ? "hide" : ""}`} alt="" />
                        </div>
                    )
                }}
            </CartFunctionsContext.Consumer>  
        )
    }
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
    browserHistory:PropTypes.object.isRequired
}

export default connect(mapStateToProps, {storeGoogleAuthenticationObject})(NavigationBar);
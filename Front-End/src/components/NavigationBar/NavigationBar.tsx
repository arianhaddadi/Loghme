import React from 'react';
import logo from '../../styles/images/Logo.png';
import {connect} from 'react-redux';
import configs from '../../app/configs.ts';
import { redirect } from '../../utils/redirect.ts';
import { RootState } from '../../app/store.ts';
import { GoogleAuthState } from '../../reducers/googleAuthenticationReducer.ts';

interface NavigationBarProps {
    googleAuthentication: GoogleAuthState,
    cartSize: number,
    openCart: () => void
}

const NavigationBar = (props: NavigationBarProps) => {

    const handleExit = () => {
        const googleAuthentication = props.googleAuthentication;
        if (googleAuthentication && googleAuthentication.isSignedIn.get()) {
            googleAuthentication.signOut();
            googleAuthentication.disconnect();
        }
        localStorage.removeItem(configs.jwt_token_name);
        redirect("/login");
    };

    return (
        <div className="navigation-bar">
            <div onClick={handleExit} className="exit">
                Logout
            </div>
            <div onClick={() => redirect("/profile")} className="profile">
                Profile
            </div>
            <i onClick={props.openCart} className="flaticon-smart-cart cart-logo"></i>
            <div onClick={props.openCart} className={`cart-quantity ${props.cartSize > 0 ? "isNotEmpty" : ""}`}>
                {props.cartSize > 0 ? props.cartSize : ""}
            </div>
            <img onClick={() => redirect("/")} src={logo} className="loghme-logo" alt="" />
        </div>
    );
}

const mapStateToProps = (state: RootState) => {
    return {
        googleAuthentication: state.googleAuthentication
    }
}

export default connect(mapStateToProps)(NavigationBar);
import React from "react";
import {connect} from "react-redux";
import { RootState } from "../../app/store";
import { GoogleAuthState } from "../../reducers/googleAuthenticationReducer";

interface GoogleOAuthProps {
    googleAuthentication: GoogleAuthState
}

const GoogleOAuth = (props: GoogleOAuthProps) => {
    const signIn = () => {
        if (props.googleAuthentication) {
            props.googleAuthentication.signIn();
        }
    }

    return (
        <button type="button" onClick={signIn} className="ui red google button google-button">
            <i className="google icon"/>
            Login With Google
        </button>
    )
}

const mapStateToProps = (state: RootState) => {
    return {
        googleAuthentication: state.googleAuthentication
    }
}

export default connect(mapStateToProps)(GoogleOAuth);
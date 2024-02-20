import React from 'react';
import {connect} from "react-redux";

class GoogleOAuth extends React.Component{


    signIn = () => {
        if (this.props.googleAuthentication !== null) {
            this.props.googleAuthentication.signIn();
        }
    }

    render() {
        return (
            <button type="button" onClick={this.signIn} className="ui red google button google-button">
                <i className="google icon"/>
                Login With Google
            </button>
        )
    }

}

const mapStateToProps = (state) => {
    return {
        googleAuthentication:state.googleAuthentication
    }
}

export default connect(mapStateToProps)(GoogleOAuth);
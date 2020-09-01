import React from 'react';
import {connect} from "react-redux";

class GoogleOAuth extends React.Component{
    // constructor(props) {
    //     super(props);
    // }


    signIn = () => {
        if (this.props.googleAuthentication !== null) {
            this.props.googleAuthentication.signIn();
        }
    }

    render() {
        return (
            <button type="button" onClick={this.signIn} className="ui red google button google-button">
                <i className="google icon"/>
                ورود با اکانت گوگل
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
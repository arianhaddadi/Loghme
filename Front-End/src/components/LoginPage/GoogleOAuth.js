import {connect} from "react-redux";

const GoogleOAuth = (props) => {
    const signIn = () => {
        if (props.googleAuthentication !== null) {
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

const mapStateToProps = (state) => {
    return {
        googleAuthentication:state.googleAuthentication
    }
}

export default connect(mapStateToProps)(GoogleOAuth);
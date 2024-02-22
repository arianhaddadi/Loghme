import logo from '../../styles/images/Logo.png';
import CartFunctionsContext from '../../contexts/CartFunctionsContext';
import {connect} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import configs from '../../configs';


const NavigationBar = (props) => {
    const navigate = useNavigate()

    const handleExit = () => {
        const googleAuthentication = props.googleAuthentication;
        if (googleAuthentication && googleAuthentication.isSignedIn.get()) {
            googleAuthentication.signOut();
            googleAuthentication.disconnect();
        }
        localStorage.removeItem(configs.jwt_token_name);
        navigate("/login");
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
                        <div onClick={() => navigate("/profile")} className={`profile ${props.hideProfile ? "hide" : ""}`}>
                            Profile
                        </div>
                        <i onClick={value.openCart} className="flaticon-smart-cart cart-logo"></i>
                        <div onClick={value.openCart} className={`cart-quantity ${numOfCartItems > 0 ? "isNotEmpty" : ""}`}>
                            {numOfCartItems > 0 ? numOfCartItems : ""}
                        </div>
                        <img onClick={() => navigate("/")} src={logo} className={`loghme-logo ${props.hideLogo ? "hide" : ""}`} alt="" />
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

export default connect(mapStateToProps)(NavigationBar);
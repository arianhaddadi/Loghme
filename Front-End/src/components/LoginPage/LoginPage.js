import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import logo from "../../images/Logo.png";
import GoogleOAuth from './GoogleOAuth';
import {Link} from 'react-router-dom';
import {storeGoogleAuthenticationObject} from '../../actions';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toastifyLength:2000,
            email: "",
            password: "",
            errors: {
                email: "",
                password: "",
            }
        };
    }

    componentDidMount = () => {
        if (localStorage.getItem("loghmeUserToken") !== null) {
            this.props.history.push("/")
        }
        else {
            document.title = "Login";
            this.handleGoogleAuth();
        }
    }

    handleGoogleAuth = () => {
        if (!window.gapi || !window.gapi.auth2) {
            window.gapi.load("client:auth2", () => {
                window.gapi.client.init({
                    clientId:"467864659090-qdhdvpgingk25pvq8m81gusn9tmflcgt.apps.googleusercontent.com",
                    scope:"email"
                }).then(() => {
                    const authentication = window.gapi.auth2.getAuthInstance();
                    authentication.isSignedIn.listen(this.handleGoogleSignIn);
                    this.props.storeGoogleAuthenticationObject(authentication);
                })
            })
        }
        else {
            this.props.googleAuthentication.signOut();
            this.props.googleAuthentication.disconnect();
        }
    }

    setToken = (token) => {
        localStorage.setItem("loghmeUserToken", token);
    }

    goToHomePage = () => {
        toast("!ورود موفقیت آمیز بود");
        setTimeout(() => {
            this.props.history.push("/");                        
        }, this.state.toastifyLength);
    }

    handleGoogleSignIn = (isSignedIn) => {
        if (isSignedIn) {
            const currentUser = this.props.googleAuthentication.currentUser.get(); 
            const email = currentUser.getBasicProfile().getEmail();
            const idToken = currentUser.getAuthResponse().id_token;
            axios.post(`http://ie.etuts.ir:30735/login?email=${email}&password=''&isGoogleAuth=${true}&idToken=${idToken}`).then((response) => {
                if (response.data.successful) {
                    this.setToken(response.data.message);
                    this.goToHomePage();
                }
            }).catch((error) => {
                this.props.googleAuthentication.signOut();
                this.props.googleAuthentication.disconnect();
                if (error.response.status === 403) {
                    toast("ایمیل شما صحیح نمی باشد و نیاز به ثبت نام دارید");
                    setTimeout(() => {
                        this.props.history.push("/signup");
                    }, this.state.toastifyLength);
                }
            })
                
        }
    }

    login = () => {
        const {email, password} = this.state;
        axios.post(`http://ie.etuts.ir:30735/login?email=${email}&password=${password}&isGoogleAuth=${false}&idToken=""`).then(
            response => {
                if (response.data.successful) {
                    this.setToken(response.data.message);
                    this.goToHomePage();
                }
                else {
                    toast("اطلاعات وارد شده صحیح نمی باشند.");
                }
            }
        ).catch((error) => {
            toast("اطلاعات وارد شده صحیح نمی باشند.");
          });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.hasError()) {
            toast("!ابتدا خطا ها را رفع کنید");
        }
        else {
            this.login();
        }
    }

    validateValues = (name, value, isAfterSubmit) => {
        let errors = this.state.errors;
        const validEmailRegex = RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);

        switch (name) {
            case 'email':
                if(((value !== "") && (!validEmailRegex.test(value))) || ((value === "") && (isAfterSubmit))) {
                    errors.email = "ایمیل معتبر نمی باشد!";
                }
                else {
                    errors.email = "";
                }
                break;
            default:
                break;
        }

        this.setState({errors, [name]: value});
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        this.validateValues(name, value, false);
        this.setState({
            [name]:value
        })
    }

    hasError = () => {
        for(let key in this.state) {
            if(key !== "errors") {
                this.validateValues(key, this.state[key], true);
            }
        }

        for(let value in this.state.errors) {
            if(this.state.errors[value] !== "") {
                return true;
            }
        }
        return false;
    }

    getFormInput = (name, labelText, type) => {
        let errorElement = "";
        if(this.state.errors[name].length > 0) {
            errorElement = (<div className='errorMessage'>{this.state.errors[name]}</div>);
        }
        else {
            errorElement = (<div className='errorMessageEmpty'>_</div>);
        }
        return (
            <div className="form-group">
                <label className="c-label">{labelText}</label>
                <input value={this.state[name]} type={type} className="form-control" onChange={this.handleChange} 
                        noValidate name={name} placeholder={labelText} />
                {errorElement}
            </div>
        )
    }
    
    render() {
        return (
            <>
                <ToastContainer autoClose={this.state.toastifyLength} />
                <div className="main-container">
                    <div className="back-filter"></div>
                    <div className="signup-box">
                        <img className="signup-logo" src={logo} alt="" />
                        <div className="signup-title">ورود</div>
                        <div className="signup-content">
                            <form onSubmit={this.handleSubmit} noValidate>
                                {this.getFormInput("email", "ایمیل", "email")}
                                {this.getFormInput("password", "رمز عبور", "password")}
                                <button type="submit" className="btn btn-primary c-button">ورود</button>
                                <Link className="goToLoginMessage" to = '/signup'>کاربر جدید هستید؟ ثبت نام کنید </Link>
                                <GoogleOAuth history={this.props.history}/>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}


LoginPage.propTypes = {
    history:PropTypes.object.isRequired,
    location:PropTypes.object.isRequired,
    match:PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        googleAuthentication:state.googleAuthentication
    }
}

export default connect(mapStateToProps, {storeGoogleAuthenticationObject})(LoginPage);
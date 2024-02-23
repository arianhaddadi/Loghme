import { useEffect, useState } from 'react';
import axios from 'axios';
import logo from "../../styles/images/Logo.png";
import GoogleOAuth from './GoogleOAuth';
import configs from '../../configs';
import {connect} from 'react-redux';
import {ToastContainer, toast} from 'react-toastify';
import {Link, useNavigate} from 'react-router-dom';
import {storeGoogleAuthenticationObject} from '../../actions';

const LoginPage = (props) => {

    const [inputValues, setInputValues] = useState({
        "email": "",
        "password": ""
    })

    const navigate = useNavigate()
    useEffect(() => {
        if (localStorage.getItem(configs.jwt_token_name)) {
            navigate("/")
        }
        else {
            document.title = "Login";
            handleGoogleAuth();
        }
    }, [])

    const handleGoogleAuth = () => {
        if (!window.gapi || !window.gapi.auth2) {
            window.gapi.load("client:auth2", () => {
                window.gapi.client.init({
                    clientId: "467864659090-qdhdvpgingk25pvq8m81gusn9tmflcgt.apps.googleusercontent.com",
                    scope: "email"
                }).then(() => {
                    const authentication = window.gapi.auth2.getAuthInstance();
                    authentication.isSignedIn.listen(handleGoogleSignIn);
                    props.storeGoogleAuthenticationObject(authentication);
                })
            })
        }
        else {
            props.googleAuthentication.signOut();
            props.googleAuthentication.disconnect();
        }
    }

    const setToken = (token) => {
        localStorage.setItem(configs.jwt_token_name, token);
    }

    const goToHomePage = () => {
        toast("Successfully Logged In!");
        setTimeout(() => {
            navigate("/");                        
        }, configs.notification_length);
    }

    const handleGoogleSignIn = (isSignedIn) => {
        if (isSignedIn) {
            const currentUser = props.googleAuthentication.currentUser.get(); 
            const email = currentUser.getBasicProfile().getEmail();
            const idToken = currentUser.getAuthResponse().id_token;
            axios.post(`${configs.server_url}/login?email=${email}&password=''&isGoogleAuth=${true}&idToken=${idToken}`)
            .then((response) => {
                if (response.data.successful) {
                    setToken(response.data.message);
                    goToHomePage();
                }
            }).catch((error) => {
                props.googleAuthentication.signOut();
                props.googleAuthentication.disconnect();
                if (error.response.status === 403) {
                    toast("No account was registered with this email address. You need to sign up first!");
                    setTimeout(() => {
                        navigate("/signup");
                    }, configs.notification_length);
                }
            })
                
        }
    }

    const login = () => {
        const {email, password} = inputValues;
        axios.post(`${configs.server_url}/login?email=${email}&password=${password}&isGoogleAuth=${false}&idToken=""`).then(
            response => {
                if (response.data.successful) {
                    setToken(response.data.message);
                    goToHomePage();
                }
                else {
                    toast("Wrong Credentials!");
                }
            }
        ).catch((error) => {
            toast("Request Failed", error);
        });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        login();
    }

    const handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setInputValues({
            ...inputValues,
            [name]: value
        })
    }

    const getFormInput = (name, labelText, type) => {
        return (
            <div className="form-group">
                <input value={inputValues[name]} type={type} className="form-control" onChange={handleChange} 
                        noValidate name={name} placeholder={labelText} />
            </div>
        )
    }
    
    return (
        <>
            <ToastContainer autoClose={configs.notification_length} />
            <div className="main-container">
                <div className="back-filter"></div>
                <div className="signup-box">
                    <img className="signup-logo" src={logo} alt="" />
                    <div className="signup-title">Login</div>
                    <div className="signup-content">
                        <form onSubmit={handleSubmit} noValidate>
                            {getFormInput("email", "Email", "email")}
                            {getFormInput("password", "Password", "password")}
                            <button type="submit" className="btn btn-primary c-button login-btn">Login</button>
                            <GoogleOAuth />
                            <Link className="goToLoginMessage" to = '/signup'>Haven't signed up before? Sign up here.</Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    return {
        googleAuthentication:state.googleAuthentication
    }
}

export default connect(mapStateToProps, {storeGoogleAuthenticationObject})(LoginPage);
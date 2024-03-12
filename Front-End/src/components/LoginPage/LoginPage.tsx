import React, { useEffect, useState } from 'react';
import logo from "../../styles/images/Logo.png";
import GoogleOAuth from './GoogleOAuth.tsx';
import configs from '../../app/configs.ts';
import {connect} from 'react-redux';
import {toast} from 'react-toastify';
import {Link} from 'react-router-dom';
import {storeGoogleAuthenticationObject} from '../../actions/index.ts';
import { redirect } from '../../utils/redirect.ts';
import { sendRequest, RequestMethods } from '../../utils/request.ts';
import { RequestArguments, ActionCreator } from '../../utils/types';
import { RootState } from '../../app/store.ts';
import { GoogleAuthState } from '../../reducers/googleAuthenticationReducer.ts';

interface LoginFormInput {
    email: string;
    password: string;
    [key: string]: string;
}

interface LoginPageProps {
    googleAuthentication: GoogleAuthState;
    storeGoogleAuthenticationObject: ActionCreator<GoogleAuthState>;
}

const LoginPage = (props: LoginPageProps) => {

    const [inputValues, setInputValues] = useState<LoginFormInput>({
        "email": "",
        "password": ""
    })

    useEffect(() => {
        if (localStorage.getItem(configs.jwt_token_name)) {
            redirect("/")
        }
        else {
            document.title = "Login";
            // handleGoogleAuth();
        }
    }, [])

    // const handleGoogleAuth = () => {
    //     if (!window.gapi || !window.gapi.auth) {
    //         window.gapi.load("client:auth2", () => {
    //             window.gapi.client.init({
    //                 clientId: "467864659090-qdhdvpgingk25pvq8m81gusn9tmflcgt.apps.googleusercontent.com",
    //                 scope: "email"
    //             }).then(() => {
    //                 const authentication = window.gapi.auth2.getAuthInstance();
    //                 authentication.isSignedIn.listen(handleGoogleSignIn);
    //                 props.storeGoogleAuthenticationObject(authentication);
    //             })
    //         })
    //     }
    //     else {
    //         props.googleAuthentication.signOut();
    //         props.googleAuthentication.disconnect();
    //     }
    // }

    const setToken = (token: string) => {
        localStorage.setItem(configs.jwt_token_name, token);
    }

    const goToHomePage = () => {
        toast("Successfully Logged In!");
        setTimeout(() => {
            redirect("/");                        
        }, configs.notification_length);
    }

    const handleGoogleSignIn = (isSignedIn: boolean) => {
        if (isSignedIn) {
            const currentUser = props.googleAuthentication.currentUser.get(); 
            const email = currentUser.getBasicProfile().getEmail();
            const idToken = currentUser.getAuthResponse().id_token;
            const requestArgs: RequestArguments =  {
                method: RequestMethods.POST,
                url: `/login?email=${email}&password=''&isGoogleAuth=${true}&idToken=${idToken}`,
                errorHandler: (error) => {
                    props.googleAuthentication.signOut();
                    props.googleAuthentication.disconnect();
                    if (error.response.status === 403) {
                        toast("No account was registered with this email address. You need to sign up first!");
                        setTimeout(() => {
                            redirect("/signup");
                        }, configs.notification_length);
                    }
                },
                successHandler: (response) => {
                    if (response.data.successful) {
                        handleSuccessfullLogin(response.data.message)
                    }
                    else {
                        toast("Login With Google Failed.")
                    }
                }
            }
            sendRequest(requestArgs)   
        }
    }

    const login = () => {
        const {email, password} = inputValues;
        const requestArgs: RequestArguments =  {
            method: RequestMethods.POST,
            url: `/login?email=${email}&password=${password}&isGoogleAuth=${false}&idToken=""`,
            errorHandler: (error) => console.log("Login Failed", error),
            successHandler: (response) => {
                if (response.data.successful) {
                    handleSuccessfullLogin(response.data.message)
                }
                else {
                    toast("Wrong Credentials!");
                }
            }
        }
        sendRequest(requestArgs)
    }

    const handleSuccessfullLogin = (token: string) => {
        setToken(token);
        goToHomePage();
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        login();
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const { name, value } = event.target;
        setInputValues({
            ...inputValues,
            [name]: value
        })
    }

    const getFormInput = (name: string, labelText: string, type: string, autoCompleteValue: string) => {
        return (
            <div className="form-group">
                <input value={inputValues[name]} type={type} className="form-control" onChange={handleChange} 
                        name={name} placeholder={labelText} autoComplete={autoCompleteValue} />
            </div>
        )
    }
    
    return (
        <>
            <div className="main-container">
                <div className="back-filter"></div>
                <div className="signup-box">
                    <img className="signup-logo" src={logo} alt="" />
                    <div className="signup-title">Login</div>
                    <div className="signup-content">
                        <form onSubmit={handleSubmit} noValidate>
                            {getFormInput("email", "Email", "email", "email")}
                            {getFormInput("password", "Password", "password", "current-password")}
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

const mapStateToProps = (state: RootState) => {
    return {
        googleAuthentication: state.googleAuthentication
    }
}

export default connect(mapStateToProps, {storeGoogleAuthenticationObject})(LoginPage);
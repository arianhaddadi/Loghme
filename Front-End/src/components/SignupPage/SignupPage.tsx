import React, {useEffect, useState} from 'react';
import logo from "../../styles/images/Logo.png";
import configs from '../../app/configs.ts';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import {RequestMethods, sendRequest} from '../../utils/request.ts';
import {redirect} from '../../utils/redirect.ts';
import {RequestArguments} from '../../utils/types';

interface SignupFormInput {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    passwordRepeat: string;

    [key: string]: string;
}

const SignupPage = () => {
    const [inputValues, setInputValues] = useState<SignupFormInput>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        passwordRepeat: "",
    })
    const [errorMessages, setErrorMessages] = useState<SignupFormInput>({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        passwordRepeat: ""
    })

    useEffect(() => {
        if (localStorage.getItem(configs.jwt_token_name)) redirect("/")
        else document.title = "Signup";
    }, [])

    const signup = () => {
        const {firstName, lastName, email, phoneNumber, password}: SignupFormInput = inputValues;
        const requestArgs: RequestArguments = {
            method: RequestMethods.POST,
            url: `/signup?firstName=${firstName}&lastName=${lastName}&password=${password}&email=${email}&phoneNumber=${phoneNumber}`,
            errorHandler: (error) => {
                toast("Signup failed. Please try again.")
                console.log(error)
            },
            successHandler: (response) => {
                if (response.data.successful) {
                    toast("Successfully Signed Up!");
                    setTimeout(() => {
                        redirect("/login")
                    }, configs.notification_length);
                } else {
                    toast("Signup failed. Email already in use!");
                }
            }
        }
        sendRequest(requestArgs)
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (hasError()) {
            toast("Fix the errors first!");
        } else {
            signup();
        }
    }

    const validateValues = (name: string, value: string, isAfterSubmit: boolean) => {
        const validEmailRegex = RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);

        switch (name) {
            case 'firstName':
            case "lastName":
                if (((value !== "") && (value.length < 2)) || ((value === "") && (isAfterSubmit))) {
                    errorMessages[name] = "First and last names must have a minimum of 5 letters.";
                } else {
                    errorMessages[name] = "";
                }
                break;
            case 'email':
                if (((value !== "") && (!validEmailRegex.test(value))) || ((value === "") && (isAfterSubmit))) {
                    errorMessages.email = "Invalid email address!";
                } else {
                    errorMessages.email = "";
                }
                break;
            case 'phoneNumber':
                if ((value !== "") && (!Number(value))) {
                    errorMessages.phoneNumber = "Invalid phone number!";
                } else if (((value !== "") && (value.length < 8)) || ((value === "") && (isAfterSubmit))) {
                    errorMessages.phoneNumber = "Phone number must have at least 8 digits!";
                } else {
                    errorMessages.phoneNumber = ""
                }
                break;
            case 'password':
                if (((value !== "") && (value.length < 8)) || ((value === "") && (isAfterSubmit))) {
                    errorMessages.password = "Password must be at least 8 letters long!";
                } else {
                    errorMessages.password = "";
                }
                if ((inputValues.passwordRepeat !== "") && (inputValues.passwordRepeat !== value)) {
                    errorMessages.passwordRepeat = "Passwords do not match!"
                } else if ((inputValues.passwordRepeat === "") && (isAfterSubmit)) {
                    errorMessages.passwordRepeat = "This field is required!"
                } else {
                    errorMessages.passwordRepeat = "";
                }
                break;
            case 'passwordRepeat':
                if ((value !== "") && (value !== inputValues.password)) {
                    errorMessages.passwordRepeat = "Passwords do not match!"
                } else if ((value === "") && (isAfterSubmit)) {
                    errorMessages.passwordRepeat = "This field is required!"
                } else {
                    errorMessages.passwordRepeat = "";
                }
                break;
            default:
                break;
        }

        setErrorMessages(errorMessages)
        setInputValues({
            ...inputValues,
            [name]: value
        })
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const {name, value}: HTMLInputElement = event.target;
        validateValues(name, value, false);
    }

    const hasError = () => {
        for (let key in inputValues) {
            validateValues(key, inputValues[key], true);
        }

        for (let value in errorMessages) {
            if (errorMessages[value] !== "") {
                return true;
            }
        }
        return false;
    }

    const getFormInput = (name: string, labelText: string, type: string, autoCompleteValue: string) => {
        let errorElement = (<div className='errorMessageEmpty'>_</div>);
        if (errorMessages[name].length > 0) {
            errorElement = (<div className='errorMessage'>{errorMessages[name]}</div>);
        }
        return (
            <div className="form-group">
                <input value={inputValues[name]} type={type} className="form-control" onChange={handleChange}
                       name={name} placeholder={labelText} autoComplete={autoCompleteValue}/>
                {errorElement}
            </div>
        )
    }


    return (
        <>
            <div className="main-container">
                <div className="back-filter"></div>
                <div className="signup-box">
                    <img className="signup-logo" src={logo} alt=""/>
                    <div className="signup-title">Signup</div>
                    <div className="signup-content">
                        <form onSubmit={handleSubmit} noValidate>
                            {getFormInput("firstName", "First Name", "text", "given-name")}
                            {getFormInput("lastName", "Last Name", "text", "family-name")}
                            {getFormInput("email", "Email", "email", "email")}
                            {getFormInput("phoneNumber", "Phone Number", "tel", "tel")}
                            {getFormInput("password", "Password", "password", "current-password")}
                            {getFormInput("passwordRepeat", "Repeat Password", "password", "current-password")}
                            <button type="submit" className="btn btn-primary c-button signup-btn">Signup</button>
                            <Link className="goToLoginMessage" to='/login'>Already signed up? Login</Link>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SignupPage;
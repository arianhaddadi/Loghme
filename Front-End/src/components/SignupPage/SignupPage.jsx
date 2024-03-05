import { useEffect, useState } from 'react';
import logo from "../../styles/images/Logo.png";
import configs from '../../configs';
import {Link, useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import { sendRequest, RequestMethods } from '../../utils';


const SignupPage = (props) => {
    const [inputValues, setInputValues] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        passwordRepeat: "",
    })
    const [errorMessages, setErrorMessages] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        password: "",
        passwordRepeat: ""
    })

    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem(configs.jwt_token_name)) navigate("/") 
        else document.title = "Signup";
    }, [])

    const signup = () => {
        const {firstName, lastName, email, phoneNumber, password} = inputValues;
        const requestArgs = {
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
                        navigate("/login")
                    }, configs.notification_length);
                }
                else {
                    toast("Signup failed. Email already in use!");
                }
            }
        }
        sendRequest(requestArgs)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(hasError()) {
            toast("Fix the errors first!");
        }
        else {
            signup();
        }
    }

    const validateValues = (name, value, isAfterSubmit) => {
        let errors = errorMessages;
        const validEmailRegex = RegExp(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/);
    
        switch (name) {
            case 'firstName':
            case "lastName":
                if(((value !== "") && (value.length < 2)) || ((value === "") && (isAfterSubmit))) {
                    errors[name] = "First and last names must have a minimum of 5 letters.";
                }
                else {
                    errors[name] = "";
                }
                break;
            case 'email': 
                if(((value !== "") && (!validEmailRegex.test(value))) || ((value === "") && (isAfterSubmit))) {
                    errors.email = "Invalid email address!";
                }
                else {
                    errors.email = "";
                }
                break;
            case 'phoneNumber':
                if((value !== "") && (!Number(value))) {
                    errors.phoneNumber = "Invalid phone number!";
                }
                else if(((value !== "") && (value.length < 8)) || ((value === "") && (isAfterSubmit))) {
                    errors.phoneNumber = "Phone number must have at least 8 digits!";
                }
                else {
                    errors.phoneNumber = ""
                }
                break;
            case 'password': 
                if(((value !== "") && (value.length < 8)) || ((value === "") && (isAfterSubmit))) {
                    errors.password = "Password must be at least 8 letters long!";
                }
                else {
                    errors.password = "";
                }
                if((inputValues.passwordRepeat !== "") && (inputValues.passwordRepeat !== value)) {
                    errors.passwordRepeat = "Passwords do not match!"
                }
                else if((inputValues.passwordRepeat === "") && (isAfterSubmit)) {
                    errors.passwordRepeat = "This field is required!"
                }
                else {
                    errors.passwordRepeat = "";
                }
                break;
            case 'passwordRepeat': 
                if((value !== "") && (value !== inputValues.password)) {
                    errors.passwordRepeat = "Passwords do not match!"
                }
                else if((value === "") && (isAfterSubmit)) {
                    errors.passwordRepeat = "This field is required!"
                }
                else {
                    errors.passwordRepeat = "";
                }
                break;
            default:
                break;
        }
        
        setErrorMessages(errors)
        setInputValues ({
            ...inputValues,
            [name]: value
        })
    }

    const handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        validateValues(name, value, false);
    }

    const hasError = () => {
        for(var key in inputValues) {
            validateValues(key, inputValues[key], true);
        }

        for(var value in errorMessages) {
            if(errorMessages[value] !== "") {
                return true;
            }
        }
        return false;
    }

    const getFormInput = (name, labelText, type, autoCompleteValue) => {
        var errorElement = "";
        if(errorMessages[name].length > 0) {
            errorElement = (<div className='errorMessage'>{errorMessages[name]}</div>);
        }
        else {
            errorElement = (<div className='errorMessageEmpty'>_</div>);
        }
        return (
            <div className="form-group">
                <input value={inputValues[name]} type={type} className="form-control" onChange={handleChange} 
                        noValidate name={name} placeholder={labelText} autoComplete={autoCompleteValue} />
                {errorElement}
            </div>
        )
    }
    

    return (
        <>
            <div className="main-container">
                <div className="back-filter"></div>
                <div className="signup-box">
                    <img className="signup-logo" src={logo} alt="" />
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
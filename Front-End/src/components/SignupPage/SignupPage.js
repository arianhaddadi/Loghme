import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import logo from "../../images/Logo.png";
import configs from '../../configs';
import {Link} from 'react-router-dom';
import {ToastContainer, toast} from 'react-toastify';

class SignupPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            toastifyLength:2000,
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            password: "",
            passwordRepeat: "",
            errors: {
                firstName: "",
                lastName:"",
                email: "",
                phoneNumber: "",
                password: "",
                passwordRepeat: ""
            }
        };
    }

    componentDidMount = () => {
        if (localStorage.getItem("loghmeUserToken") !== null) {
            this.props.history.push("/")
        }
        else {
            document.title = "Signup";
        }
    }

    signup = () => {
        const {firstName, lastName, email, phoneNumber, password} = this.state;
        axios.post(`${configs.server_url}/signup?firstName=${firstName}&lastName=${lastName}&password=${password}&email=${email}&phoneNumber=${phoneNumber}`)
        .then(response => {
            if (response.data.successful) {
                toast("Successfully Signed Up!");
                setTimeout(() => {
                    this.props.history.push("/login");
                }, this.state.toastifyLength);
            }
            else {
                toast("Signup failed. Email already in use!");
            }
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.hasError()) {
            toast("Fix the errors first!");
        }
        if(!this.hasError()) {
            this.signup();
        }
    }

    validateValues = (name, value, isAfterSubmit) => {
        let errors = this.state.errors;
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
                if((this.state.passwordRepeat !== "") && (this.state.passwordRepeat !== value)) {
                    errors.passwordRepeat = "Passwords do not match!"
                }
                else if((this.state.passwordRepeat === "") && (isAfterSubmit)) {
                    errors.passwordRepeat = "This field is required!"
                }
                else {
                    errors.passwordRepeat = "";
                }
                break;
            case 'passwordRepeat': 
                if((value !== "") && (value !== this.state.password)) {
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
    
        this.setState({errors, [name]: value});
    }

    handleChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        this.validateValues(name, value, false);
    }

    hasError = () => {
        for(var key in this.state) {
            if(key !== "errors") {
                this.validateValues(key, this.state[key], true);
            }
        }

        for(var value in this.state.errors) {
            if(this.state.errors[value] !== "") {
                return true;
            }
        }
        return false;
    }

    getFormInput = (name, labelText, type) => {
        var errorElement = "";
        if(this.state.errors[name].length > 0) {
            errorElement = (<div className='errorMessage'>{this.state.errors[name]}</div>);
        }
        else {
            errorElement = (<div className='errorMessageEmpty'>_</div>);
        }
        return (
            <div className="form-group">
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
                        <div className="signup-title">Signup</div>
                        <div className="signup-content">
                            <form onSubmit={this.handleSubmit} noValidate>
                                {this.getFormInput("firstName", "First Name", "text")}
                                {this.getFormInput("lastName", "Last Name", "text")}
                                {this.getFormInput("email", "Email", "email")}
                                {this.getFormInput("phoneNumber", "Phone Number", "tel")}
                                {this.getFormInput("password", "Password", "password")}
                                {this.getFormInput("passwordRepeat", "Repeat Password", "password")}
                                <button type="submit" className="btn btn-primary c-button signup-btn">Signup</button>
                                <Link className="goToLoginMessage" to='/login'>Already signed up? Login</Link>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

SignupPage.propTypes = {
    history:PropTypes.object.isRequired,
}

export default SignupPage;
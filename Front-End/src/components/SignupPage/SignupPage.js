import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {Link} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import logo from "../../images/Logo.png";

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
        axios.post(`http://ie.etuts.ir:30735/signup?firstName=${firstName}&lastName=${lastName}&password=${password}&email=${email}&phoneNumber=${phoneNumber}`)
        .then(response => {
            if (response.data.successful) {
                toast("!ثبت نام موفقیت آمیز بود");
                setTimeout(() => {
                    this.props.history.push("/login");
                }, this.state.toastifyLength);
            }
            else {
                toast("!ثبت نام موفقیت آمیز نبود! ایمیل وارد شده قبلا در سیستم ثبت شده است");
            }
        })
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if(this.hasError()) {
            toast("!ابتدا خطا ها را رفع کنید");
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
                    errors[name] = "نام و نام خانوادگی باید حداقل ۵ حرف داشته باشند!";
                }
                else {
                    errors[name] = "";
                }
                break;
            case 'email': 
                if(((value !== "") && (!validEmailRegex.test(value))) || ((value === "") && (isAfterSubmit))) {
                    errors.email = "ایمیل معتبر نمی باشد!";
                }
                else {
                    errors.email = "";
                }
                break;
            case 'phoneNumber':
                if((value !== "") && (!Number(value))) {
                    errors.phoneNumber = "شماره تلفن باید عدد باشد!"
                }
                else if(((value !== "") && (value.length < 8)) || ((value === "") && (isAfterSubmit))) {
                    errors.phoneNumber = "شماره تلفن باید حداقل ۸ رقم داشته باشد!"
                }
                else {
                    errors.phoneNumber = ""
                }
                break;
            case 'password': 
                if(((value !== "") && (value.length < 8)) || ((value === "") && (isAfterSubmit))) {
                    errors.password = "پسورد باید حداقل ۸ حرف داشته باشد!"
                }
                else {
                    errors.password = "";
                }
                if((this.state.passwordRepeat !== "") && (this.state.passwordRepeat !== value)) {
                    errors.passwordRepeat = "تکرار پسورد مانند پسورد نیست!"
                }
                else if((this.state.passwordRepeat === "") && (isAfterSubmit)) {
                    errors.passwordRepeat = "این فیلد پر نشده است!"
                }
                else {
                    errors.passwordRepeat = "";
                }
                break;
            case 'passwordRepeat': 
                if((value !== "") && (value !== this.state.password)) {
                    errors.passwordRepeat = "تکرار پسورد مانند پسورد نیست!"
                }
                else if((value === "") && (isAfterSubmit)) {
                    errors.passwordRepeat = "این فیلد پر نشده است!"
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
                        <div className="signup-title">ثبت نام</div>
                        <div className="signup-content">
                            <form onSubmit={this.handleSubmit} noValidate>
                                {this.getFormInput("firstName", "نام", "text")}
                                {this.getFormInput("lastName", "نام خانوادگی", "text")}
                                {this.getFormInput("email", "ایمیل", "email")}
                                {this.getFormInput("phoneNumber", "شماره تلفن", "tel")}
                                {this.getFormInput("password", "رمز عبور", "password")}
                                {this.getFormInput("passwordRepeat", "تکرار رمز عبور", "password")}
                                <button type="submit" className="btn btn-primary c-button">ثبت نام</button>
                                <Link className="goToLoginMessage" to='/login'>قبلاً ثبت نام کردید؟ وارد شوید</Link>
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
    location:PropTypes.object.isRequired,
    match:PropTypes.object.isRequired
}

export default SignupPage;
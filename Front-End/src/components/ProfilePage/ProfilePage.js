import React from 'react';
import axios from 'axios';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {fetchAndStoreOrders, fetchAndStoreUserInfo} from "../../actions";
import Modal from '../Modal/Modal';
import Spinner from '../Spinner/Spinner';
import {convertEnglishNumbersToPersian, calculateOrderPrice, preventBubbling} from "../../utilities";
import NavigationBar from '../NavigationBar/NavigationBar';


class ProfilePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {visibleOrder:null, creditsNotification:null, creditsLoading:false, creditsInputValue:""};
    }

    componentDidMount() {
        document.title = "Profile";
        this.props.fetchAndStoreOrders();
        this.props.fetchAndStoreUserInfo();
        this.ordersUpdater = setInterval(this.props.fetchAndStoreOrders, 30 * 1000);
    }

    componentWillUnmount = () => {
        clearInterval(this.ordersUpdater);
    }

    renderPersonalInfoItem = (info, iconClass) => {
        return (
            <div className="personal-info-item">
                <div>{info}</div>
                <i className={iconClass}></i>
            </div>
        );
    }

    addCredit = () => {
        const value = this.state.creditsInputValue;
        if (value === "") {
            this.setState({
                creditsInputValue:"",
                creditsNotification:{
                    status:"error",
                    message:"ورودی نمیتواند خالی باشد.",
                }
            });
        }
        else if(isNaN(value)) {
            this.setState({
                creditsInputValue:"",
                creditsNotification:{
                    status:"error",
                    message:"ورودی باید عدد باشد.",
                }
            });
        }
        else if(parseFloat(value) < 0) {
            this.setState({
                creditsInputValue:"",
                creditsNotification:{
                    status:"error",
                    message:"امکان کاهش اعتبار وجود ندارد."
                }
            })
        }
        else {
            axios.put(`http://ie.etuts.ir:30735/credits?amount=${value}`, {}, { headers: { 'Authorization': `Bearer ${localStorage.getItem("loghmeUserToken")}`}})
            .then(() => {
                this.setState({
                    creditsLoading:false,
                    creditsInputValue:"",
                    creditsNotification:{
                        status:"success",
                        message:"افزایش اعتبار با موفقیت انجام شد.",
                    }
                })
                this.props.fetchAndStoreUserInfo();
            });
            this.setState({
                creditsNotification:null,
                creditsLoading:true
            })
        }
    }

    renderCreditsNotification = () => {
        if(this.state.creditsNotification !== null) {
            return (
                <div className={`credits-notification ${this.state.creditsNotification.status}`}>
                    {this.state.creditsNotification.message}
                </div>
            )
        }
    }

    renderCreditsSpinner = () => {
        if(this.state.creditsLoading) {
            return (
                <Spinner additionalClassName="credits-spinner col-12" />
            )
        }
    }

    renderCreditsTab = () => {
        return (
            <div className="tab">
                <input id="credit-tab" name="tabgroup" type="radio" />
                <label htmlFor="credit-tab">
                    افزایش اعتبار
                </label>
                <div className="row credit-content">
                    <button onClick={this.addCredit} type="button" className="btn btn-primary add-credit-button col-3">
                        افزایش
                    </button>
                    <input className="credit-input btn col-8" value={this.state.creditsInputValue} onChange={(event) => this.setState({creditsInputValue:event.target.value})} placeholder="میزان افزایش اعتبار" />
                    {this.renderCreditsNotification()}
                    {this.renderCreditsSpinner()}
                </div>
            </div>
        )
    } 

    renderOrderStatusButton = (deliveryStatus) => {
        if (deliveryStatus === "DELIVERY_ON_ITS_WAY") {
            return (
                <div className="btn-success on-the-way-button" >
                    پیک در مسیر
                </div>
            )
        }
        else if (deliveryStatus === "SEARCHING_FOR_DELIVERY") {
            return (
                <div className="btn-info">
                    در جست و جوی پیک
                </div>
            )
        }
        else {
            return (
                <div className="btn-warning">
                    مشاهده فاکتور
                </div>
            )
        }
    }

    viewOrder = (order) => {
        this.setState({visibleOrder:order});
    }

    renderOrdersRows = (orders) => {
        if (this.props.orders === null) {
            return (
                <Spinner additionalClassName="orders-spinner"/>
            );
        }
        else {
            if (orders.length === 0) {
                return (
                    <div className="no-orders">
                        سفارشی وجود ندارد.
                    </div>
                )
            }
            return orders.map((elem, index) => {
                return (
                    <div key={index} onClick={() => this.viewOrder(elem)} className="order">
                        <div className="order-index">{convertEnglishNumbersToPersian(index+1)}</div>
                        <div className="order-restaurant-name">
                            {elem.cart.restaurant.name}
                        </div>
                        <div className="order-status">
                            {this.renderOrderStatusButton(elem.status)}
                        </div>
                    </div>
                )
            })
        }
    }

    renderOrderItems = (cartItems) => {
        return cartItems.map((elem, index) => {
            return (
                <div key={index} className="order-modal-item">
                    <div className="price">
                        {convertEnglishNumbersToPersian(elem.food.price)}
                    </div>
                    <div className="quantity">
                        {convertEnglishNumbersToPersian(elem.quantity)}
                    </div>
                    <div className="food-name">
                       {elem.food.name}
                    </div>
                    <div className="index">
                        {convertEnglishNumbersToPersian(index + 1)}
                    </div>
                </div>
            );
        });
    }

    renderOrderInfo = (order) => {
        return (
            <div onClick={(event) => preventBubbling(event)} className="order-modal">
                <div className="order-modal-restaurant-name">
                    {order.cart.restaurant.name}
                </div>
                <hr />
                <div className="order-modal-items-table">
                    <div className="order-modal-items-table-head">
                        <div className="price">
                            قیمت
                        </div>
                        <div className="quantity">
                            تعداد
                        </div>
                        <div className="food-name">
                            نام غذا
                        </div>
                        <div className="index">
                            ردیف
                        </div>
                    </div>
                    {this.renderOrderItems(order.cart.cartItems)}
                    <div className="order-modal-price">
                        <b>
                        جمع کل:{calculateOrderPrice(order.cart.cartItems)} تومان
                        </b>
                    </div>
                </div>
            </div>
        )
    }

    closeOrderModal = () => {
        this.setState({visibleOrder:null});
    } 

    renderOrderModal = () => {
        if(this.state.visibleOrder !== null) {
            return (
                <Modal close={this.closeOrderModal} render={() => this.renderOrderInfo(this.state.visibleOrder)} />  
            )
        }
    }

    handleClickOnOrdersTab = () => {
        this.props.fetchAndStoreOrders();
        this.setState({
            creditsNotification:null
        })
    }

    renderOrdersTab = () => {
        return (
            <div className="tab">
                <input id="orders-tab" name="tabgroup" type="radio" defaultChecked/>
                <label htmlFor="orders-tab" onClick={this.handleClickOnOrdersTab}>
                    سفارش ها
                </label>
                <div className="orders-content">
                    {this.renderOrdersRows(this.props.orders)}
                </div>
            </div>
        );
    }

    renderProfileInfo = () => {
        if(this.props.user !== null) {
            const user = this.props.user;
            return (
                <>
                    <div className="username">
                        <i className="flaticon-account name-logo"></i>
                        <b>
                            {user.name + " " + user.familyName}
                        </b>
                    </div>
                    <div className="personal-info">
                        {this.renderPersonalInfoItem(convertEnglishNumbersToPersian(user.phoneNumber), "flaticon-phone")}
                        {this.renderPersonalInfoItem(user.email, "flaticon-mail")}
                        {this.renderPersonalInfoItem(`${convertEnglishNumbersToPersian(user.credit)} تومان`, "flaticon-card")}
                    </div>
                </>
            )
        }
    }

    render() {
        return (
            <>  
                <NavigationBar hideProfile browserHistory={this.props.history}/>
                <div className="head-bar profile">
                    {this.renderProfileInfo()}
                </div>
                <div className="tabs">
                    {this.renderCreditsTab()}
                    {this.renderOrdersTab()}
                </div>
                {this.renderOrderModal()}
            </>
        );
    }
}

ProfilePage.propTypes = {
    orders:PropTypes.array,
    user:PropTypes.object,
    history:PropTypes.object.isRequired,
    location:PropTypes.object.isRequired,
    match:PropTypes.object.isRequired
}

const mapStateToProps = (state) => {
    return {
        orders:state.orders,
        user:state.user,
    }
}


export default connect(mapStateToProps, {fetchAndStoreOrders, fetchAndStoreUserInfo})(ProfilePage);
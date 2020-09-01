import React from 'react';
import {connect} from 'react-redux';
import axios from 'axios';
import PropTypes from 'prop-types';
import {convertEnglishNumbersToPersian, preventBubbling} from '../../utilities';
import Spinner from '../Spinner/Spinner';
import {fetchAndStoreCart, fetchAndStoreFoodPartyInformation} from '../../actions';

class FoodModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {numOfAvailableFood: this.props.isFoodParty ? props.item.food.count : undefined, numOfFoodToOrder:1, isLoading:false, notification:null};
    }

    renderOldPrice = (food) => {
        if(this.props.isFoodParty) {
            return (
                <div className="food-modal-old-price">
                    {convertEnglishNumbersToPersian(food.oldPrice)}
                </div>
            )
        }
    }

    renderNumOfAvailableFood = () => {
        if(this.props.isFoodParty) {
            return (
                <div className="food-modal-available-quantity">
                    {this.state.numOfAvailableFood === 0 ? "ناموجود" : `موجودی:${convertEnglishNumbersToPersian(this.state.numOfAvailableFood)}`}
                </div>
            )
        }
    }

    increaseFoodQuantity = () => {
        if(this.state.numOfFoodToOrder >= this.state.numOfAvailableFood) {
            this.setState({
                notification:{
                    status:"error",
                    message:"بیش از این تعداد از غذا موجود نیست."
                }
            })
        }
        else {
            this.setState({numOfFoodToOrder: this.state.numOfFoodToOrder + 1, notification:null});
        }
    }

    decreaseFoodQuantity = () => {
        if(this.state.numOfFoodToOrder > 1) {
            this.setState({numOfFoodToOrder: this.state.numOfFoodToOrder - 1, notification:null});
        } 
    }

    addToCart = () => {
        axios.put(`http://ie.etuts.ir:30735/carts?foodName=${this.props.item.food.name}&restaurantId=${this.props.item.restaurant.id}&quantity=${this.state.numOfFoodToOrder}&isFoodPartyFood=${this.props.isFoodParty}`, {},
                 { headers: { Authorization: `Bearer ${localStorage.getItem("loghmeUserToken")}`}})
        .then((response) => {
            if(response.data.successful) {
                this.props.fetchAndStoreCart();
                if(this.props.isFoodParty) this.props.fetchAndStoreFoodPartyInformation();
                this.setState({
                    isLoading:false,
                    numOfAvailableFood:this.state.numOfAvailableFood - this.state.numOfFoodToOrder,
                    notification:{
                        status:"success",
                        message:"غذای مورد نظر به سبد خرید افزوده شد.",
                    }
                })
            }
            else {
                this.setState({
                    isLoading:false,
                    notification:{
                        status:"error",
                        message:response.data.message === "You have other food from other restaurants in your cart!" ?
                                                         "شما در سبد خرید خود غذاهای دیگری از رستوران های دیگری دارید." :
                                                         "موجودی این غذا کافی نیست."
                    }
                })
            }
        });
        this.setState({
            isLoading:true
        })
    }

    renderSpinner = () => {
        if(this.state.isLoading) {
            return (
                <Spinner additionalClassName="food-modal-spinner" />
            )
        }
    }

    renderContent = () => {
        const {food, restaurant} = this.props.item;
        return (
            <>
                <div className="food-modal-restaurant-name">
                    {restaurant.name}
                </div>
                <div className="food-modal-image-info">
                    <img className="food-modal-image" src={food.image} alt=""/>
                    <div className="food-modal-info">
                        <div className="food-modal-food-name-star">
                            <div className="food-modal-food-name">
                                {food.name}
                            </div>
                            <div className="food-modal-star-popularity">
                                <i className="fas fa-star food-modal-star"></i>
                                <div className="food-modal-popularity">
                                    {convertEnglishNumbersToPersian(food.popularity * 5)}       
                                </div>    
                            </div>
                        </div>
                        <div className="food-modal-food-description">
                            {food.description}
                        </div>
                        <div className="food-modal-prices">
                            {this.renderOldPrice(food)}
                            <div className="food-modal-price">
                                {convertEnglishNumbersToPersian(food.price)} تومان
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`food-modal-quantity-order ${this.props.isFoodParty ? "" : "ordinaryFood"}`}>
                    {this.renderNumOfAvailableFood()}
                    <div className="food-modal-order">
                        <div className="food-modal-order-quantity">
                            <i onClick={this.increaseFoodQuantity} className="flaticon-plus plus-logo"></i>
                            <div className="food-modal-order-quantity-num">{convertEnglishNumbersToPersian(this.state.numOfFoodToOrder)}</div>
                            <i onClick={this.decreaseFoodQuantity} className="flaticon-minus minus-logo"></i>
                        </div>
                        <button onClick={this.addToCart} type="button" className="btn btn-primary submit-button">اضافه کردن به سبد خرید</button>
                    </div>
                </div>
                {this.renderSpinner()}
            </>
        )
    }

    renderNotification = () => {
        if(this.state.notification !== null) {
            return (
                <div className={`food-modal-notification ${this.state.notification.status}`}>
                    {this.state.notification.message}
                </div>
            )
        }
    }

    render() {  
        return (
            <div onClick={(event) => preventBubbling(event)}  className="food-modal-container">
               {this.renderContent()}
               {this.renderNotification()}
            </div>
        )
    }
}

FoodModal.propTypes = {
    isFoodParty:PropTypes.bool.isRequired,
    item:PropTypes.object.isRequired
}

export default connect(null, {fetchAndStoreCart, fetchAndStoreFoodPartyInformation})(FoodModal);
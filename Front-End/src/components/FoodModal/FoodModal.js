import React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import Spinner from '../Spinner/Spinner';
import configs from '../../configs';

import {connect} from 'react-redux';
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
                    {food.oldPrice}
                </div>
            )
        }
    }

    renderNumOfAvailableFood = () => {
        if(this.props.isFoodParty) {
            return (
                <div className="food-modal-available-quantity">
                    {this.state.numOfAvailableFood === 0 ? "Not Available" : `Number of Remaining Items: ${this.state.numOfAvailableFood}`}
                </div>
            )
        }
    }

    increaseFoodQuantity = () => {
        if(this.state.numOfFoodToOrder >= this.state.numOfAvailableFood) {
            this.setState({
                notification:{
                    status:"error",
                    message:"Not available!"
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
        axios.put(`${configs.server_url}/carts?foodName=${this.props.item.food.name}&restaurantId=${this.props.item.restaurant.id}&quantity=${this.state.numOfFoodToOrder}&isFoodPartyFood=${this.props.isFoodParty}`, {},
                 { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}})
        .then((response) => {
            if(response.data.successful) {
                this.props.fetchAndStoreCart();
                if(this.props.isFoodParty) this.props.fetchAndStoreFoodPartyInformation();
                this.setState({
                    isLoading:false,
                    numOfAvailableFood:this.state.numOfAvailableFood - this.state.numOfFoodToOrder,
                    notification:{
                        status:"success",
                        message:"Added To Cart!",
                    }
                })
            }
            else {
                this.setState({
                    isLoading:false,
                    notification:{
                        status:"error",
                        message:response.data.message
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
                                    {food.popularity * 5}       
                                </div>    
                            </div>
                        </div>
                        <div className="food-modal-food-description">
                            {food.description}
                        </div>
                        <div className="food-modal-prices">
                            {this.renderOldPrice(food)}
                            <div className="food-modal-price">
                                {food.price} Dollars
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`food-modal-quantity-order ${this.props.isFoodParty ? "" : "ordinaryFood"}`}>
                    {this.renderNumOfAvailableFood()}
                    <div className="food-modal-order">
                        <div className="food-modal-order-quantity">
                            <i onClick={this.increaseFoodQuantity} className="flaticon-plus plus-logo"></i>
                            <div className="food-modal-order-quantity-num">{this.state.numOfFoodToOrder}</div>
                            <i onClick={this.decreaseFoodQuantity} className="flaticon-minus minus-logo"></i>
                        </div>
                        <button onClick={this.addToCart} type="button" className="btn btn-primary submit-button">Add To Cart</button>
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
            <div onClick={(event) => event.stopPropagation()}  className="food-modal-container">
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
import {useEffect, useState} from 'react';
import axios from 'axios';
import logo from '../../styles/images/Logo.png';
import Spinner from "../Spinner/Spinner";
import Modal from '../utils/Modal';
import FoodModal from '../FoodModal/FoodModal';
import NavigationBar from '../NavigationBar/NavigationBar';
import FoodPartyItem from './FoodPartyItem';
import RestaurantItem from './RestaurantItem';
import configs from '../../configs';
import {ToastContainer, toast} from 'react-toastify';
import {useNavigate} from 'react-router-dom';

const HomePage = (props) => {
    const [visibleFoodItem, setVisibleFoodItem] = useState(null)
    const [searchRestaurantNameValue, setSearchRestaurantName] = useState("")
    const [searchFoodNameValue, setSearchFoodName] = useState("")
    const [searchedRestaurants, setSearchedRestaurants] = useState(null)
    const [isSearching, setIsSearching] = useState(false)
    const [isLoadingMore, setIsLoadingMore] = useState(false)
    const [restaurants, setRestaurants] = useState([])
    const [foodPartyRestaurants, setFoodPartyRestaurants] = useState(null)
    const [foodPartyMinutesRemaining, setFoodPartyMinutesRemaining] = useState(0)
    const [foodPartySecondsRemaining, setFoodPartySecondsRemaining] = useState(0)
    const [numOfPages, setNumOfPages] = useState(1)
    const [numOfPagesSearchResults, setNumOfPagesSearchResults] = useState(1)
    
    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Home";
        fetchFoodPartyInformation();
        fetchRestaurants(1);
    }, [])

    useEffect(() => {
        if (foodPartyMinutesRemaining === 0 && foodPartySecondsRemaining === 0) return;
        setTimeout(downCountTimer, 1000)
    }, [foodPartySecondsRemaining, foodPartyMinutesRemaining])

    const fetchRestaurants = (pageNum) => {
        axios.get(`${configs.server_url}/restaurants?pageSize=${configs.home_page_size}&pageNum=${pageNum}`, 
            { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}})
        .then(response => {
            setRestaurants(restaurants.concat(response.data.list))
            setIsLoadingMore(false)
        })
        .catch(error => {
            console.log("Fetching Restaurants Failed", error);
        });
        
    }

    const fetchFoodPartyInformation = () => {
        axios.get(`${configs.server_url}/foodparties`, { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}})
        .then(response => {
            setFoodPartyRestaurants(response.data.list);
            setFoodPartyMinutesRemaining(response.data.responseMessage.minutes)
            setFoodPartySecondsRemaining(response.data.responseMessage.seconds)
        })
        .catch(error => {
            console.log("Fetching Food Party Information Failed", error);
        });
    }

    const downCountTimer = () => {
        if(foodPartyMinutesRemaining !== 0 || foodPartySecondsRemaining !== 0) {
            if(foodPartySecondsRemaining === 0) {
                setFoodPartySecondsRemaining(59)
                setFoodPartyMinutesRemaining(foodPartyMinutesRemaining - 1)
            }
            else {
                setFoodPartySecondsRemaining(foodPartySecondsRemaining - 1)
            }
        }
        else {
            fetchFoodPartyInformation();
        }
    }

    const orderFoodPartyFood = (restaurant, food) => {
        setVisibleFoodItem({
            restaurant: restaurant,
            food: food
        });
    }
    
    const renderFoodPartyItems = () => {
        if(foodPartyRestaurants) {
            if(foodPartyRestaurants.length === 0) {
                return (
                    <div className="no-food-party-restaurants-notification">
                        No restaurants are currently in food party.
                    </div>
                );
            }
            else {
                let foodpartyItems = [];
                for (let i = 0; i < foodPartyRestaurants.length; i++) {
                    foodpartyItems = foodpartyItems.concat(foodPartyRestaurants[i].foodPartyMenu.map(
                    (elem, index) => {
                        return (
                            <FoodPartyItem key={`${i}` + index} orderFood={orderFoodPartyFood} restaurant={foodPartyRestaurants[i]} item={elem} />
                        )
                    }))
                }
                return foodpartyItems;
            }
        }
        else {
            return (
                <Spinner additionalClassName="food-party-spinner"/>
            )
        }
    }

    const viewRestaurantPage = (restaurantId) => {
        navigate(`/restaurants/${restaurantId}`);
    }

    const loadMore = () => {
        if (searchedRestaurants === null) {
            fetchRestaurants(numOfPages + 1);
            setNumOfPages(numOfPages + 1);
        }
        else {
            search(numOfPagesSearchResults + 1)
            setNumOfPagesSearchResults(numOfPagesSearchResults + 1);
        }
        setIsLoadingMore(true)
    }

    const renderLoadingMoreSpinner = () => {
        if (isLoadingMore || isSearching) {
            return (
                <Spinner additionalClassName="loading-more-spinner" />
            )
        }
    }

    const renderShowMoreButton = () => {
        return (
            <>
                <button onClick={loadMore} className="submit-button btn show-more-button">Show More</button>
                {renderLoadingMoreSpinner()}
            </>
        )
    }

    const renderRestaurantItems = () => {
        const restaurantsToRender = searchedRestaurants === null ? restaurants : searchedRestaurants;
        return restaurantsToRender.map((elem, index) => {
            return (
                <RestaurantItem key={index} item={elem} viewRestaurantPage={viewRestaurantPage} />
            )}
        )
    }

    const renderRestaurants = () => {
        if (restaurants.length === 0 || (isSearching && searchedRestaurants === null)) {
            return (
                <Spinner additionalClassName="" />
            )
        }
        else {
            return (
                <>
                    <div className="restaurants-home-items">
                        {renderRestaurantItems()}
                    </div>
                    {renderShowMoreButton()}
                </>
            )
        }
    }
    
    const renderRestaurantsSection = () => {
        return (
            <div className="restaurants-home">
                <div className="home-title">
                    Restaurants
                </div>
                <hr className="home-title-hr"/>
                {renderRestaurants()}
            </div>
        )
    }

    const styleTime = (time) => {
        time = time.toString();
        if(time.length === 1) time = "0" + time;
        return time;
    }

    const renderFoodPartyTimer = () => {
        if(foodPartyRestaurants) {
            const minutesRemainingStyled = styleTime(foodPartyMinutesRemaining);
            const secondsRemainingStyled = styleTime(foodPartySecondsRemaining);
            return (
                <div className="food-party-home-timer">
                    {/* Remaining Time: {minutesRemaining}:{secondsRemaining} */}
                    Remaining Time: {minutesRemainingStyled}:{secondsRemainingStyled}

                </div>
            )
        }
    }

    const renderFoodPartySection = () => {
        return (
            <div className="food-party-home">
                <div className="home-title">
                     Food Party
                </div>
                <hr className="home-title-hr"/>
                {renderFoodPartyTimer()}
                <div className="food-party-home-items">
                    {renderFoodPartyItems()}
                </div>
            </div>
        )
    }

    const closeFoodPartyModal = () => {
        fetchFoodPartyInformation();
        setVisibleFoodItem(null)
    }

    const showFoodPartyModal = () => {
        return (
            <FoodModal isFoodParty item={visibleFoodItem} />
        )
    }

    const renderFoodPartyModal = () => {
        if(visibleFoodItem) {
            return (
                <Modal close={closeFoodPartyModal} render={showFoodPartyModal} />
            )
        }
    }

    const search = (pageNum) => {
        axios.get(`${configs.server_url}/search?foodName=${searchFoodNameValue}&restaurantName=${searchRestaurantNameValue}&pageSize=${configs.home_page_size}&pageNum=${pageNum}`,
                 { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}})
            .then(response => {
                if (searchedRestaurants === null) {
                    setSearchedRestaurants(response.data.list)
                } else {
                    setSearchedRestaurants(searchedRestaurants.concat(response.data.list))
                }
                setIsSearching(false)
                setIsLoadingMore(false)
                if(response.data.list.length === 0) {
                    toast("No more items found.");
                }
                else {
                    toast("Search was successfull.");
                }
            }
        )
        setIsSearching(true)
    }

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        if((searchRestaurantNameValue === "") && (searchFoodNameValue === "")) {
            toast("Please complete at least one of the fields!")
        }
        else {
            setNumOfPagesSearchResults(1)
            setSearchedRestaurants(null)
            search(1);
        }
    }

    const handleSearchChange = (event) => {
        event.preventDefault();
        const {name, value} = event.target;
        if (name === "searchFoodName") setSearchFoodName(value);
        else setSearchRestaurantName(value);
    }


    return (
        <>  
            <NavigationBar hideLogo />
            <ToastContainer autoClose={configs.notification_length} />
            <div className="home-container">
                <div className="home-head-bar">
                    <img onClick={() => setSearchedRestaurants(null)} src={logo} className="loghme-logo-home" alt="" />
                    <div className="restaurant-desription-home">
                        The best online food ordering website in the world!
                    </div>
                    <form className="search-bar-home" onSubmit={handleSearchSubmit} noValidate>
                        <button type="submit" className="btn btn-warning">Search</button>
                        <input name="searchRestaurantName" onChange={handleSearchChange} 
                            noValidate type="text" className="btn search-bar-home-restaurant-name" 
                            placeholder="Restaurant Name" value={searchRestaurantNameValue}/>
                        <input name="searchFoodName" onChange={handleSearchChange} 
                            noValidate type="text" className="btn search-bar-home-food-name" 
                            placeholder="Food Name" value={searchFoodNameValue}/>
                    </form>
                    <div className="head-bar-cover"></div>
                </div>
                {renderFoodPartySection()}
                {renderRestaurantsSection()}
            </div>
            {renderFoodPartyModal()}
        </>
    )
}

export default HomePage;

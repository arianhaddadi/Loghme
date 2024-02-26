import {useState, useEffect} from 'react';
import RestaurantItem from './RestaurantItem';
import {useNavigate} from 'react-router-dom';
import configs from '../../configs';
import Spinner from "../utils/Spinner";
import axios from 'axios';



const RestaurantsSection = (props) => {
    const [restaurants, setRestaurants] = useState([])
    const [numOfPages, setNumOfPages] = useState(1)
    const [isLoadingMore, setIsLoadingMore] = useState(false)


    const navigate = useNavigate()

    useEffect(() => {
        document.title = "Home";
        fetchRestaurants(1);
    }, [])

    const fetchRestaurants = (pageNum) => {
        axios.get(`${configs.server_url}/restaurants?pageSize=${configs.home_page_size}&pageNum=${pageNum}`, 
            { headers: { Authorization: `Bearer ${localStorage.getItem(configs.jwt_token_name)}`}})
        .then(response => {
            setRestaurants(restaurants.concat(response.data.payload))
            setIsLoadingMore(false)
        })
        .catch(error => {
            console.log("Fetching Restaurants Failed", error);
        });
        setIsLoadingMore(true)
    }

    const viewRestaurantPage = (restaurantId) => {
        navigate(`/restaurants/${restaurantId}`);
    }

    const renderLoadingMoreSpinner = () => {
        if (isLoadingMore || props.isSearching) {
            return (
                <Spinner additionalClassName="loading-more-spinner" />
            )
        }
    }

    const loadMore = () => {
        if (props.searchedRestaurants === null) {
            fetchRestaurants(numOfPages + 1);
            setNumOfPages(numOfPages + 1);
        }
        else {
            props.searchMore()
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
        const restaurantsToRender = props.searchedRestaurants === null ? restaurants : props.searchedRestaurants;
        return restaurantsToRender.map((elem, index) => {
            return (
                <RestaurantItem key={index} item={elem} viewRestaurantPage={viewRestaurantPage} />
            )}
        )
    }

    const renderRestaurants = () => {
        if (restaurants.length === 0 ||
            (props.isSearching && props.searchedRestaurants === null)) {
            
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


    return (
        <div className="restaurants-home">
            <div className="home-title">
                Restaurants
            </div>
            <hr className="home-title-hr"/>
            {renderRestaurants()}
        </div>
    )
};

export default RestaurantsSection;

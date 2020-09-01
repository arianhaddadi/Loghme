package Mappers.Restaurant;

import Domain.Restaurant.RestaurantDAO;
import Entities.Location;
import Mappers.Mapper;
import Utilities.ConnectionPool;

import java.sql.*;
import java.util.ArrayList;

public class RestaurantMapper extends Mapper<RestaurantDAO, String> implements IRestaurantMapper {

    private static RestaurantMapper instance;

    public static RestaurantMapper getInstance() {
        if (instance == null) {
            instance = new RestaurantMapper();
        }
        return instance;
    }

    private RestaurantMapper() {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(
            "CREATE TABLE IF NOT EXISTS Restaurants" +
                "(" +
                    "id VARCHAR(300) PRIMARY KEY, " +
                    "name VARCHAR(300)," +
                    "logo VARCHAR(300)," +
                    "locationX FLOAT," +
                    "locationY FLOAT" +
                ");"
            );
            preparedStatement.executeUpdate();
            preparedStatement.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    private PreparedStatement getFindByNameAndMenuStatement(String foodName, String restaurantName,
                                                            Connection connection, Integer limitStart, Integer limitSize) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement(
                             "SELECT r.* \n" +
                                "FROM Restaurants r, Foods fd " +
                                "WHERE r.id = fd.restaurantId " +
                                "AND ((r.locationX * r.locationX) + (r.locationY * r.locationY)) <= 170 * 170 " +
                                "AND r.name LIKE ? AND fd.name LIKE ? " +
                                "GROUP BY r.id " +
                                "LIMIT ?,?;");


        preparedStatement.setString(1, "%" + restaurantName + "%");
        preparedStatement.setString(2, "%" + foodName + "%");
        preparedStatement.setInt(3, limitStart);
        preparedStatement.setInt(4, limitSize);
        return preparedStatement;
    }

    public ArrayList<RestaurantDAO> findByNameAndMenu(String foodName, String restaurantName,
                                                      Integer limitStart, Integer limitSize) {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = getFindByNameAndMenuStatement(foodName, restaurantName, connection,
                                                                                limitStart, limitSize);
            ResultSet resultSet = preparedStatement.executeQuery();
            ArrayList<RestaurantDAO> restaurantDAOS = new ArrayList<>();
            while (resultSet.next()) {
                restaurantDAOS.add(convertResultSetToObject(resultSet));
            }
            resultSet.close();
            preparedStatement.close();
            connection.close();
            return restaurantDAOS;
        }catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    @Override
    protected PreparedStatement getFindStatement(String id, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Restaurants r WHERE r.id = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getInsertStatement(RestaurantDAO restaurant, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("INSERT IGNORE INTO Restaurants VALUES (?, ?, ?, ?, ?);");
        preparedStatement.setString(1, restaurant.getId());
        preparedStatement.setString(2, restaurant.getName());
        preparedStatement.setString(3, restaurant.getLogo());
        preparedStatement.setFloat(4, restaurant.getLocation().getX());
        preparedStatement.setFloat(5, restaurant.getLocation().getY());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getUpdateStatement(RestaurantDAO restaurantDAO, Connection connection) {
        return null;
    }

    @Override
    protected PreparedStatement getDeleteStatement(String id, Connection connection) {
        return null;
    }

    @Override
    protected RestaurantDAO convertResultSetToObject(ResultSet resultSet) throws SQLException {
        RestaurantDAO restaurant = new RestaurantDAO();
        restaurant.setId(resultSet.getString("id"));
        restaurant.setName(resultSet.getString("name"));
        restaurant.setLogo(resultSet.getString("logo"));
        restaurant.setLocation(new Location(resultSet.getFloat("locationX"), resultSet.getFloat("locationY")));
        return restaurant;
    }

    @Override
    protected PreparedStatement getFindAllStatement(String id, Connection connection,
                                                    Integer limitStart, Integer limitSize) throws SQLException {
        if (limitStart != null && limitSize != null) {
            PreparedStatement preparedStatement = connection.prepareStatement(
                             "SELECT * FROM Restaurants r " +
                                "WHERE ((r.locationX * r.locationX) + (r.locationY * r.locationY)) <= 170 * 170 " +
                                "LIMIT ?,?;");
            preparedStatement.setInt(1, limitStart);
            preparedStatement.setInt(2, limitSize);
            return preparedStatement;
        }
        else {
            return connection.prepareStatement(
                    "SELECT * FROM Restaurants r " +
                       "WHERE ((r.locationX * r.locationX) + (r.locationY * r.locationY)) <= 170 * 170;");
        }
    }

}

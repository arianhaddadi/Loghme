package Mappers.FoodPartyFood;

import Domain.Restaurant.FoodPartyFoodDAO;
import Mappers.Mapper;
import Utilities.ConnectionPool;

import java.sql.*;

public class FoodPartyFoodMapper extends Mapper<FoodPartyFoodDAO, String> implements IFoodPartyFoodMapper {

    private static FoodPartyFoodMapper instance;

    public static FoodPartyFoodMapper getInstance() {
        if (instance == null) {
            instance = new FoodPartyFoodMapper();
        }
        return instance;
    }

    private FoodPartyFoodMapper() {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(
                "CREATE TABLE IF NOT EXISTS FoodPartyFoods" +
                "(" +
                    "name VARCHAR(300), " +
                    "description VARCHAR(300)," +
                    "image VARCHAR(300)," +
                    "price FLOAT," +
                    "oldPrice FLOAT," +
                    "count INT," +
                    "popularity FLOAT," +
                    "restaurantId VARCHAR(300)," +
                    "valid BOOLEAN, " +
                    "FOREIGN KEY (restaurantId) REFERENCES Restaurants(id) ON UPDATE CASCADE ON DELETE CASCADE," +
                    "PRIMARY KEY (name, restaurantId)" +
                ");"
            );
            preparedStatement.executeUpdate();
            preparedStatement.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    @Override
    protected PreparedStatement getFindStatement(String id, Connection connection) throws SQLException{
        String[] idSegments = id.split(",");
        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM FoodPartyFoods fd " +
                                                                             "WHERE fd.name = ? " +
                                                                             "AND fd.restaurantId = ?;");

        preparedStatement.setString(1, idSegments[0]);
        preparedStatement.setString(2, idSegments[1]);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getInsertStatement(FoodPartyFoodDAO foodPartyFood, Connection connection) throws SQLException {
            PreparedStatement preparedStatement = connection.prepareStatement("INSERT IGNORE INTO FoodPartyFoods " +
                                                                                 "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);");
            preparedStatement.setString(1, foodPartyFood.getName());
            preparedStatement.setString(2, foodPartyFood.getDescription());
            preparedStatement.setString(3, foodPartyFood.getImage());
            preparedStatement.setFloat(4, foodPartyFood.getPrice());
            preparedStatement.setFloat(5, foodPartyFood.getOldPrice());
            preparedStatement.setInt(6, foodPartyFood.getCount());
            preparedStatement.setFloat(7, foodPartyFood.getPopularity());
            preparedStatement.setString(8, foodPartyFood.getRestaurantId());
            preparedStatement.setBoolean(9, true);
            return preparedStatement;
    }

    @Override
    protected PreparedStatement getUpdateStatement(FoodPartyFoodDAO foodPartyFoodDAO, Connection connection) throws SQLException {
            PreparedStatement preparedStatement = connection.prepareStatement("UPDATE FoodPartyFoods fd " +
                                                                                 "SET fd.count = ? " +
                                                                                 "WHERE fd.name = ? AND " +
                                                                                 "fd.restaurantId = ?;");
            preparedStatement.setInt(1, foodPartyFoodDAO.getCount());
            preparedStatement.setString(2, foodPartyFoodDAO.getName());
            preparedStatement.setString(3, foodPartyFoodDAO.getRestaurantId());
            return preparedStatement;
    }

    @Override
    protected PreparedStatement getFindAllStatement(String id, Connection connection,
                                                    Integer limitStart, Integer limitSize) throws SQLException {

        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM FoodPartyFoods fd " +
                                                                             "WHERE fd.restaurantId = ? " +
                                                                             "AND fd.valid = TRUE;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getDeleteStatement(String id, Connection connection) throws SQLException {
        return null;
    }

    @Override
    protected FoodPartyFoodDAO convertResultSetToObject(ResultSet resultSet) throws SQLException {
        FoodPartyFoodDAO foodPartyFoodDAO = new FoodPartyFoodDAO();
        foodPartyFoodDAO.setName(resultSet.getString("name"));
        foodPartyFoodDAO.setDescription(resultSet.getString("description"));
        foodPartyFoodDAO.setImage(resultSet.getString("image"));
        foodPartyFoodDAO.setPrice(resultSet.getFloat("price"));
        foodPartyFoodDAO.setOldPrice(resultSet.getFloat("oldPrice"));
        foodPartyFoodDAO.setCount(resultSet.getInt("count"));
        foodPartyFoodDAO.setPopularity(resultSet.getFloat("popularity"));
        foodPartyFoodDAO.setRestaurantId(resultSet.getString("restaurantId"));
        return foodPartyFoodDAO;
    }

    private PreparedStatement getDeleteAllStatement(Connection connection) throws SQLException {
        return connection.prepareStatement("UPDATE FoodPartyFoods fd " +
                                              "SET fd.valid = FALSE;");
    }

    public void deleteAll() {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = getDeleteAllStatement(connection);
            preparedStatement.executeUpdate();
            preparedStatement.close();
            connection.close();
        }catch (SQLException e) {
            e.printStackTrace();
        }
    }
}

package Mappers.Food;

import Domain.Restaurant.FoodDAO;
import Mappers.Mapper;
import Utilities.ConnectionPool;

import java.sql.*;

public class FoodMapper extends Mapper<FoodDAO, String> implements IFoodMapper {
    private static FoodMapper instance;

    public static FoodMapper getInstance() {
        if (instance == null) {
            instance = new FoodMapper();
        }
        return instance;
    }

    private FoodMapper() {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(
                "CREATE TABLE IF NOT EXISTS Foods" +
                "(" +
                    "name VARCHAR(300), " +
                    "description VARCHAR(300)," +
                    "image VARCHAR(300)," +
                    "price FLOAT," +
                    "popularity FLOAT," +
                    "restaurantId VARCHAR(300), " +
                    "FOREIGN KEY (restaurantId) REFERENCES Restaurants(id) ON UPDATE CASCADE ON DELETE CASCADE, " +
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
    protected PreparedStatement getFindStatement(String id, Connection connection) throws SQLException {
        String[] idSegments = id.split(",");
        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Foods fd " +
                                                                             "WHERE fd.name = ? " +
                                                                             "AND fd.restaurantId = ?;");

        preparedStatement.setString(1, idSegments[0]);
        preparedStatement.setString(2, idSegments[1]);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getInsertStatement(FoodDAO food, Connection connection) throws SQLException{
        PreparedStatement preparedStatement = connection.prepareStatement("INSERT IGNORE INTO Foods VALUES (?, ?, ?, ?, ?, ?);");
        preparedStatement.setString(1, food.getName());
        preparedStatement.setString(2, food.getDescription());
        preparedStatement.setString(3, food.getImage());
        preparedStatement.setFloat(4, food.getPrice());
        preparedStatement.setFloat(5, food.getPopularity());
        preparedStatement.setString(6, food.getRestaurantId());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getDeleteStatement(String id, Connection connection) throws SQLException {
        return null;
    }

    @Override
    protected PreparedStatement getUpdateStatement(FoodDAO foodDAO, Connection connection) throws SQLException {
        return null;
    }

    @Override
    protected PreparedStatement getFindAllStatement(String id, Connection connection,
                                                    Integer limitStart, Integer limitSize) throws SQLException {

        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Foods fd " +
                                                                             "WHERE fd.restaurantId = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected FoodDAO convertResultSetToObject(ResultSet resultSet) throws SQLException {
        FoodDAO foodDAO = new FoodDAO();
        foodDAO.setName(resultSet.getString("name"));
        foodDAO.setDescription(resultSet.getString("description"));
        foodDAO.setImage(resultSet.getString("image"));
        foodDAO.setPopularity(resultSet.getFloat("popularity"));
        foodDAO.setPrice(resultSet.getFloat("price"));
        foodDAO.setRestaurantId(resultSet.getString("restaurantId"));
        return foodDAO;
    }
}

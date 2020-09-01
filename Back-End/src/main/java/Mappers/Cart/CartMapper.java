package Mappers.Cart;

import Domain.Cart.CartDAO;
import Mappers.Mapper;
import Utilities.ConnectionPool;

import java.sql.*;

public class CartMapper extends Mapper<CartDAO, String> implements ICartMapper {
    private static CartMapper instance;

    public static CartMapper getInstance() {
        if (instance == null) {
            instance = new CartMapper();
        }
        return instance;
    }

    private CartMapper() {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(
            "CREATE TABLE IF NOT EXISTS Carts" +
                "(" +
                    "userId VARCHAR(300), " +
                    "restaurantId VARCHAR(300), " +
                    "PRIMARY KEY (userId), " +
                    "FOREIGN KEY (userId) REFERENCES Users(email) ON UPDATE CASCADE ON DELETE CASCADE" +
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
        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Carts c WHERE c.userId = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getInsertStatement(CartDAO cartDAO, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("INSERT IGNORE INTO Carts VALUES (?, ?);");
        preparedStatement.setString(1, cartDAO.getUserId());
        preparedStatement.setString(2, cartDAO.getRestaurantId());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getDeleteStatement(String id, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("DELETE FROM Carts WHERE userId = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getUpdateStatement(CartDAO cartDAO, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("UPDATE Carts " +
                "SET restaurantId = ? " +
                "WHERE userId = ?;");
        preparedStatement.setString(1, cartDAO.getRestaurantId());
        preparedStatement.setString(2, cartDAO.getUserId());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getFindAllStatement(String id, Connection connection,
                                                    Integer limitStart, Integer limitSize) throws SQLException {
        return null;
    }

    @Override
    protected CartDAO convertResultSetToObject(ResultSet resultSet) throws SQLException {
        CartDAO cartDAO = new CartDAO();
        cartDAO.setUserId(resultSet.getString("userId"));
        cartDAO.setRestaurantId(resultSet.getString("restaurantId"));
        return cartDAO;
    }
}

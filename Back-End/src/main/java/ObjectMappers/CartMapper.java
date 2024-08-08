package ObjectMappers;

import Domain.DatabaseDTOs.CartDTO;
import Utilities.ConnectionPool;

import java.sql.*;

public class CartMapper extends Mapper<CartDTO, String> {
    private static CartMapper instance;

    private CartMapper() {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement =
                    connection.prepareStatement(
                            "CREATE TABLE IF NOT EXISTS Carts"
                                    + "("
                                    + "userId VARCHAR(300), "
                                    + "restaurantId VARCHAR(300), "
                                    + "PRIMARY KEY (userId), "
                                    + "FOREIGN KEY (userId) REFERENCES Users(email) ON UPDATE CASCADE ON DELETE CASCADE"
                                    + ");");
            preparedStatement.executeUpdate();
            preparedStatement.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static CartMapper getInstance() {
        if (instance == null) {
            instance = new CartMapper();
        }
        return instance;
    }

    @Override
    protected PreparedStatement getFindStatement(String id, Connection connection)
            throws SQLException {
        PreparedStatement preparedStatement =
                connection.prepareStatement("SELECT * FROM Carts WHERE userId = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getInsertStatement(CartDTO cartDTO, Connection connection)
            throws SQLException {
        PreparedStatement preparedStatement =
                connection.prepareStatement("INSERT IGNORE INTO Carts VALUES (?, ?);");
        preparedStatement.setString(1, cartDTO.getUserId());
        preparedStatement.setString(2, cartDTO.getRestaurantId());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getDeleteStatement(String id, Connection connection)
            throws SQLException {
        PreparedStatement preparedStatement =
                connection.prepareStatement("DELETE FROM Carts WHERE userId = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getUpdateStatement(CartDTO cartDTO, Connection connection)
            throws SQLException {
        PreparedStatement preparedStatement =
                connection.prepareStatement(
                        "UPDATE Carts " + "SET restaurantId = ? " + "WHERE userId = ?;");
        preparedStatement.setString(1, cartDTO.getRestaurantId());
        preparedStatement.setString(2, cartDTO.getUserId());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getFindAllStatement(
            String id, Connection connection, Integer limitStart, Integer limitSize)
            throws SQLException {
        return null;
    }

    @Override
    protected CartDTO convertResultSetToObject(ResultSet resultSet) throws SQLException {
        CartDTO cartDTO = new CartDTO();
        cartDTO.setUserId(resultSet.getString("userId"));
        cartDTO.setRestaurantId(resultSet.getString("restaurantId"));
        return cartDTO;
    }
}

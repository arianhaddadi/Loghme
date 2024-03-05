package ObjectMappers.CartItem;

import Domain.DatabaseDTOs.CartItemDTO;
import ObjectMappers.Mapper;
import Utilities.ConnectionPool;

import java.sql.*;

public class CartItemMapper extends Mapper<CartItemDTO, String> {
    private static CartItemMapper instance;

    public static CartItemMapper getInstance() {
        if (instance == null) {
            instance = new CartItemMapper();
        }
        return instance;
    }

    private CartItemMapper() {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(
            "CREATE TABLE IF NOT EXISTS CartItems" +
                "(" +
                    "quantity INT, " +
                    "cartId VARCHAR(100), " +
                    "foodName VARCHAR(300), " +
                    "restaurantId VARCHAR(100)," +
                    "PRIMARY KEY (cartId, foodName, restaurantId), " +
                    "FOREIGN KEY (cartId) REFERENCES Carts(userId) ON UPDATE CASCADE ON DELETE CASCADE" +
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
        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM CartItems " +
                                                                             "WHERE cartId = ? " +
                                                                             "AND foodName = ? " +
                                                                             "AND restaurantId = ?;");
        preparedStatement.setString(1, idSegments[0]);
        preparedStatement.setString(2, idSegments[1]);
        preparedStatement.setString(3, idSegments[2]);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getInsertStatement(CartItemDTO cartItemDTO, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("INSERT IGNORE INTO CartItems VALUES (?, ?, ?, ?);");
        preparedStatement.setInt(1, cartItemDTO.getQuantity());
        preparedStatement.setString(2, cartItemDTO.getCartId());
        preparedStatement.setString(3, cartItemDTO.getFoodName());
        preparedStatement.setString(4, cartItemDTO.getRestaurantId());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getDeleteStatement(String id, Connection connection) throws SQLException {
        String[] idSegments = id.split(",");
        PreparedStatement preparedStatement = connection.prepareStatement("DELETE FROM CartItems " +
                                                                             "WHERE cartId = ? " +
                                                                             "AND foodName = ? " +
                                                                             "AND restaurantId = ?;");
        preparedStatement.setString(1, idSegments[0]);
        preparedStatement.setString(2, idSegments[1]);
        preparedStatement.setString(3, idSegments[2]);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getUpdateStatement(CartItemDTO cartItemDTO, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("UPDATE CartItems " +
                                                                             "SET quantity = ? " +
                                                                             "WHERE cartId = ? " +
                                                                             "AND foodName = ? " +
                                                                             "AND restaurantId = ?;");
        preparedStatement.setInt(1, cartItemDTO.getQuantity());
        preparedStatement.setString(2, cartItemDTO.getCartId());
        preparedStatement.setString(3, cartItemDTO.getFoodName());
        preparedStatement.setString(4, cartItemDTO.getRestaurantId());
        return preparedStatement;
    }

    @Override
    protected CartItemDTO convertResultSetToObject(ResultSet resultSet) throws SQLException {
        CartItemDTO cartItemDTO = new CartItemDTO();
        cartItemDTO.setQuantity(resultSet.getInt("quantity"));
        cartItemDTO.setCartId(resultSet.getString("cartId"));
        cartItemDTO.setFoodName(resultSet.getString("foodName"));
        cartItemDTO.setRestaurantId(resultSet.getString("restaurantId"));
        return cartItemDTO;
    }

    @Override
    protected PreparedStatement getFindAllStatement(String id, Connection connection,
                                                    Integer limitStart, Integer limitSize) throws SQLException{

        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM CartItems WHERE cartId = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }
}

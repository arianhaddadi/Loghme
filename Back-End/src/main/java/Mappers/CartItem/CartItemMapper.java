package Mappers.CartItem;

import Domain.Cart.CartItemDAO;
import Mappers.Mapper;
import Utilities.ConnectionPool;

import java.sql.*;

public class CartItemMapper extends Mapper<CartItemDAO, String> implements ICartItemMapper {
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
        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM CartItems i " +
                                                                             "WHERE i.cartId = ? " +
                                                                             "AND i.foodName = ? " +
                                                                             "AND i.restaurantId = ?;");
        preparedStatement.setString(1, idSegments[0]);
        preparedStatement.setString(2, idSegments[1]);
        preparedStatement.setString(3, idSegments[2]);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getInsertStatement(CartItemDAO cartItemDAO, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("INSERT IGNORE INTO CartItems VALUES (?, ?, ?, ?);");
        preparedStatement.setInt(1, cartItemDAO.getQuantity());
        preparedStatement.setString(2, cartItemDAO.getCartId());
        preparedStatement.setString(3, cartItemDAO.getFoodName());
        preparedStatement.setString(4, cartItemDAO.getRestaurantId());
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
    protected PreparedStatement getUpdateStatement(CartItemDAO cartItemDAO, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("UPDATE CartItems " +
                                                                             "SET quantity = ? " +
                                                                             "WHERE cartId = ? " +
                                                                             "AND foodName = ? " +
                                                                             "AND restaurantId = ?;");
        preparedStatement.setInt(1, cartItemDAO.getQuantity());
        preparedStatement.setString(2, cartItemDAO.getCartId());
        preparedStatement.setString(3, cartItemDAO.getFoodName());
        preparedStatement.setString(4, cartItemDAO.getRestaurantId());
        return preparedStatement;
    }

    @Override
    protected CartItemDAO convertResultSetToObject(ResultSet resultSet) throws SQLException {
        CartItemDAO cartItemDAO = new CartItemDAO();
        cartItemDAO.setQuantity(resultSet.getInt("quantity"));
        cartItemDAO.setCartId(resultSet.getString("cartId"));
        cartItemDAO.setFoodName(resultSet.getString("foodName"));
        cartItemDAO.setRestaurantId(resultSet.getString("restaurantId"));
        return cartItemDAO;
    }

    @Override
    protected PreparedStatement getFindAllStatement(String id, Connection connection,
                                                    Integer limitStart, Integer limitSize) throws SQLException{

        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM CartItems WHERE cartId = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }
}

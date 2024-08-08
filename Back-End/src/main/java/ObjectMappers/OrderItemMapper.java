package ObjectMappers;

import Domain.DatabaseDTOs.OrderItemDTO;
import Utilities.ConnectionPool;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class OrderItemMapper extends Mapper<OrderItemDTO, String> {
    private static OrderItemMapper instance;

    private OrderItemMapper() {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement =
                    connection.prepareStatement(
                            "CREATE TABLE IF NOT EXISTS OrderItems"
                                    + "("
                                    + "quantity INT, "
                                    + "orderId VARCHAR(100), "
                                    + "foodName VARCHAR(300), "
                                    + "restaurantId VARCHAR(100),"
                                    + "PRIMARY KEY (orderId, foodName, restaurantId), "
                                    + "FOREIGN KEY (orderId) REFERENCES Orders(id) ON UPDATE CASCADE ON DELETE CASCADE"
                                    + ");");
            preparedStatement.executeUpdate();
            preparedStatement.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public static OrderItemMapper getInstance() {
        if (instance == null) {
            instance = new OrderItemMapper();
        }
        return instance;
    }

    @Override
    protected PreparedStatement getFindStatement(String id, Connection connection)
            throws SQLException {
        return null;
    }

    @Override
    protected PreparedStatement getInsertStatement(OrderItemDTO orderItemDTO, Connection connection)
            throws SQLException {
        PreparedStatement preparedStatement =
                connection.prepareStatement("INSERT IGNORE INTO OrderItems VALUES (?, ?, ?, ?);");
        preparedStatement.setInt(1, orderItemDTO.getQuantity());
        preparedStatement.setString(2, orderItemDTO.getOrderId());
        preparedStatement.setString(3, orderItemDTO.getFoodName());
        preparedStatement.setString(4, orderItemDTO.getRestaurantId());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getDeleteStatement(String id, Connection connection)
            throws SQLException {
        return null;
    }

    @Override
    protected PreparedStatement getUpdateStatement(OrderItemDTO obj, Connection connection)
            throws SQLException {
        return null;
    }

    @Override
    protected PreparedStatement getFindAllStatement(
            String id, Connection connection, Integer limitStart, Integer limitSize)
            throws SQLException {

        PreparedStatement preparedStatement =
                connection.prepareStatement("SELECT * FROM OrderItems WHERE orderId = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected OrderItemDTO convertResultSetToObject(ResultSet rs) throws SQLException {
        OrderItemDTO orderItemDTO = new OrderItemDTO();
        orderItemDTO.setQuantity(rs.getInt("quantity"));
        orderItemDTO.setOrderId(rs.getString("orderId"));
        orderItemDTO.setFoodName(rs.getString("foodName"));
        orderItemDTO.setRestaurantId(rs.getString("restaurantId"));
        return orderItemDTO;
    }
}

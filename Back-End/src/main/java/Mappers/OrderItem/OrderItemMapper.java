package Mappers.OrderItem;

import Domain.Order.OrderItemDAO;
import Mappers.Mapper;
import Utilities.ConnectionPool;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class OrderItemMapper  extends Mapper<OrderItemDAO, String> implements IOrderItemMapper {
    private static OrderItemMapper instance;

    public static OrderItemMapper getInstance() {
        if (instance == null) {
            instance = new OrderItemMapper();
        }
        return instance;
    }

    private OrderItemMapper() {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(
            "CREATE TABLE IF NOT EXISTS OrderItems" +
                "(" +
                    "quantity INT, " +
                    "orderId VARCHAR(100), " +
                    "foodName VARCHAR(300), " +
                    "restaurantId VARCHAR(100)," +
                    "PRIMARY KEY (orderId, foodName, restaurantId), " +
                    "FOREIGN KEY (orderId) REFERENCES Orders(id) ON UPDATE CASCADE ON DELETE CASCADE" +
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
        return null;
    }

    @Override
    protected PreparedStatement getInsertStatement(OrderItemDAO orderItemDAO, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("INSERT IGNORE INTO OrderItems VALUES (?, ?, ?, ?);");
        preparedStatement.setInt(1, orderItemDAO.getQuantity());
        preparedStatement.setString(2, orderItemDAO.getOrderId());
        preparedStatement.setString(3, orderItemDAO.getFoodName());
        preparedStatement.setString(4, orderItemDAO.getRestaurantId());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getDeleteStatement(String id, Connection connection) throws SQLException {
        return null;
    }

    @Override
    protected PreparedStatement getUpdateStatement(OrderItemDAO obj, Connection connection) throws SQLException {
        return null;
    }

    @Override
    protected PreparedStatement getFindAllStatement(String id, Connection connection,
                                                    Integer limitStart, Integer limitSize) throws SQLException {

        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM OrderItems WHERE orderId = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected OrderItemDAO convertResultSetToObject(ResultSet rs) throws SQLException {
        OrderItemDAO orderItemDAO = new OrderItemDAO();
        orderItemDAO.setQuantity(rs.getInt("quantity"));
        orderItemDAO.setOrderId(rs.getString("orderId"));
        orderItemDAO.setFoodName(rs.getString("foodName"));
        orderItemDAO.setRestaurantId(rs.getString("restaurantId"));
        return orderItemDAO;
    }

}

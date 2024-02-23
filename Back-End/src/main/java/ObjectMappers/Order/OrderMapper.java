package ObjectMappers.Order;

import Domain.DatabaseDTOs.OrderDTO;
import ObjectMappers.Mapper;
import Utilities.ConnectionPool;

import java.sql.*;

public class OrderMapper extends Mapper<OrderDTO, String> implements IOrderMapper{
    private static OrderMapper instance;

    public static OrderMapper getInstance() {
        if (instance == null) {
            instance = new OrderMapper();
        }
        return instance;
    }

    private OrderMapper() {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(
                    "CREATE TABLE IF NOT EXISTS Orders" +
                            "(" +
                            "id VARCHAR(300), " +
                            "status VARCHAR(300), " +
                            "userId VARCHAR(300), " +
                            "deliveryStartTime BIGINT, " +
                            "deliveryTime BIGINT, " +
                            "PRIMARY KEY (id), " +
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
        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Orders WHERE id = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getInsertStatement(OrderDTO orderDTO, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("INSERT IGNORE INTO Orders VALUES (?, ?, ?, ?, ?);");
        preparedStatement.setString(1, orderDTO.getId());
        preparedStatement.setString(2, orderDTO.getStatus());
        preparedStatement.setString(3, orderDTO.getUserId());
        preparedStatement.setLong(4, orderDTO.getDeliveryStartTime());
        preparedStatement.setLong(5, orderDTO.getDeliveryTime());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getDeleteStatement(String id, Connection connection) throws SQLException {
        return null;
    }

    @Override
    protected PreparedStatement getUpdateStatement(OrderDTO orderDTO, Connection connection) throws SQLException {
PreparedStatement preparedStatement = connection.prepareStatement("UPDATE Orders " +
                                                                     "SET status = ?, " +
                                                                     "deliveryStartTime = ?, " +
                                                                     "deliveryTime = ? " +
                                                                     "WHERE id = ?;");
        preparedStatement.setString(1, orderDTO.getStatus());
        preparedStatement.setLong(2, orderDTO.getDeliveryStartTime());
        preparedStatement.setLong(3, orderDTO.getDeliveryTime());
        preparedStatement.setString(4, orderDTO.getId());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getFindAllStatement(String id, Connection connection,
                                                    Integer limitStart, Integer limitSize) throws SQLException {

        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Orders WHERE userId = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected OrderDTO convertResultSetToObject(ResultSet rs) throws SQLException {
        OrderDTO orderDTO = new OrderDTO();
        orderDTO.setId(rs.getString("id"));
        orderDTO.setStatus(rs.getString("status"));
        orderDTO.setUserId(rs.getString("userId"));
        orderDTO.setDeliveryStartTime(rs.getLong("deliveryStartTime"));
        orderDTO.setDeliveryTime(rs.getLong("deliveryTime"));
        return orderDTO;
    }

    @Override
    public int getCount() {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement("SELECT COUNT(*) AS total FROM Orders");
            ResultSet resultSet = preparedStatement.executeQuery();
            int count;
            if (resultSet.next()) {
                count = resultSet.getInt("total");
            } else {
                count = -1;
            }
            resultSet.close();
            preparedStatement.close();
            connection.close();
            return count;
        } catch (SQLException e) {
            e.printStackTrace();
            return -1;
        }
    }
}

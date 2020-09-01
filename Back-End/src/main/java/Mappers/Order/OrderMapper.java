package Mappers.Order;

import Domain.Order.OrderDAO;
import Mappers.Mapper;
import Utilities.ConnectionPool;

import java.sql.*;

public class OrderMapper extends Mapper<OrderDAO, String> implements IOrderMapper{
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
        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Orders u WHERE u.id = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getInsertStatement(OrderDAO orderDAO, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("INSERT IGNORE INTO Orders VALUES (?, ?, ?, ?, ?);");
        preparedStatement.setString(1, orderDAO.getId());
        preparedStatement.setString(2, orderDAO.getStatus());
        preparedStatement.setString(3, orderDAO.getUserId());
        preparedStatement.setLong(4, orderDAO.getDeliveryStartTime());
        preparedStatement.setLong(5, orderDAO.getDeliveryTime());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getDeleteStatement(String id, Connection connection) throws SQLException {
        return null;
    }

    @Override
    protected PreparedStatement getUpdateStatement(OrderDAO orderDAO, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("UPDATE Orders " +
                                                                             "SET status = ?, " +
                                                                             "deliveryStartTime = ?, " +
                                                                             "deliveryTime = ? " +
                                                                             "WHERE id = ?;");
        preparedStatement.setString(1, orderDAO.getStatus());
        preparedStatement.setLong(2, orderDAO.getDeliveryStartTime());
        preparedStatement.setLong(3, orderDAO.getDeliveryTime());
        preparedStatement.setString(4, orderDAO.getId());
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
    protected OrderDAO convertResultSetToObject(ResultSet rs) throws SQLException {
        OrderDAO orderDAO = new OrderDAO();
        orderDAO.setId(rs.getString("id"));
        orderDAO.setStatus(rs.getString("status"));
        orderDAO.setUserId(rs.getString("userId"));
        orderDAO.setDeliveryStartTime(rs.getLong("deliveryStartTime"));
        orderDAO.setDeliveryTime(rs.getLong("deliveryTime"));
        return orderDAO;
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

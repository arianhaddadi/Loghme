package Mappers.User;

import Domain.User.UserDAO;
import Mappers.Mapper;
import Utilities.ConnectionPool;

import java.sql.*;

public class UserMapper extends Mapper<UserDAO, String> implements IUserMapper {
    private static UserMapper instance;

    public static UserMapper getInstance() {
        if (instance == null) {
            instance = new UserMapper();
        }
        return instance;
    }

    private UserMapper() {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(
            "CREATE TABLE IF NOT EXISTS Users" +
                "(" +
                    "name VARCHAR(300)," +
                    "familyName VARCHAR(300)," +
                    "email VARCHAR(300)," +
                    "password VARCHAR(300)," +
                    "phoneNumber VARCHAR(300)," +
                    "credit FLOAT," +
                    "PRIMARY KEY (email)" +
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
        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Users u WHERE u.email = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getInsertStatement(UserDAO userDAO, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("INSERT IGNORE INTO Users VALUES (?, ?, ?, ?, ?, ?);");
        preparedStatement.setString(1, userDAO.getName());
        preparedStatement.setString(2, userDAO.getFamilyName());
        preparedStatement.setString(3, userDAO.getEmail());
        preparedStatement.setString(4, userDAO.getPassword());
        preparedStatement.setString(5, userDAO.getPhoneNumber());
        preparedStatement.setFloat(6, userDAO.getCredit());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getDeleteStatement(String id, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("DELETE FROM Users WHERE email = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getUpdateStatement(UserDAO userDAO, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("UPDATE Users SET credit = ? WHERE email = ?;");
        preparedStatement.setFloat(1, userDAO.getCredit());
        preparedStatement.setString(2, userDAO.getEmail());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getFindAllStatement(String id, Connection connection,
                                                    Integer limitStart, Integer limitSize) throws SQLException {

        return null;
    }

    @Override
    protected UserDAO convertResultSetToObject(ResultSet rs) throws SQLException {
        UserDAO userDAO = new UserDAO();
        userDAO.setName(rs.getString("name"));
        userDAO.setFamilyName(rs.getString("familyName"));
        userDAO.setEmail(rs.getString("email"));
        userDAO.setPhoneNumber(rs.getString("phoneNumber"));
        userDAO.setCredit(rs.getFloat("credit"));
        return userDAO;
    }

    @Override
    public UserDAO findUserByEmailAndPassword(String email, String password) {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Users u WHERE u.email = ? AND u.password = ?;");
            preparedStatement.setString(1, email);
            preparedStatement.setString(2, password);
            ResultSet resultSet = preparedStatement.executeQuery();
            UserDAO user;
            if (resultSet.next()) {
                user = convertResultSetToObject(resultSet);
            }
            else {
                user = null;
            }
            resultSet.close();
            preparedStatement.close();
            connection.close();
            return user;
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }
}

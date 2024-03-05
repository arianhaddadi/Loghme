package ObjectMappers;

import Domain.DatabaseDTOs.UserDTO;
import Utilities.ConnectionPool;

import java.sql.*;

public class UserMapper extends Mapper<UserDTO, String> {
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
        PreparedStatement preparedStatement = connection.prepareStatement("SELECT * FROM Users WHERE email = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getInsertStatement(UserDTO userDTO, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("INSERT IGNORE INTO Users VALUES (?, ?, ?, ?, ?, ?);");
        preparedStatement.setString(1, userDTO.getName());
        preparedStatement.setString(2, userDTO.getFamilyName());
        preparedStatement.setString(3, userDTO.getEmail());
        preparedStatement.setString(4, userDTO.getPassword());
        preparedStatement.setString(5, userDTO.getPhoneNumber());
        preparedStatement.setFloat(6, userDTO.getCredit());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getDeleteStatement(String id, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("DELETE FROM Users WHERE email = ?;");
        preparedStatement.setString(1, id);
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getUpdateStatement(UserDTO userDTO, Connection connection) throws SQLException {
        PreparedStatement preparedStatement = connection.prepareStatement("UPDATE Users SET credit = ? WHERE email = ?;");
        preparedStatement.setFloat(1, userDTO.getCredit());
        preparedStatement.setString(2, userDTO.getEmail());
        return preparedStatement;
    }

    @Override
    protected PreparedStatement getFindAllStatement(String id, Connection connection,
                                                    Integer limitStart, Integer limitSize) throws SQLException {

        return null;
    }

    @Override
    protected UserDTO convertResultSetToObject(ResultSet rs) throws SQLException {
        UserDTO userDTO = new UserDTO();
        userDTO.setName(rs.getString("name"));
        userDTO.setFamilyName(rs.getString("familyName"));
        userDTO.setEmail(rs.getString("email"));
        userDTO.setPassword(rs.getString("password"));
        userDTO.setPhoneNumber(rs.getString("phoneNumber"));
        userDTO.setCredit(rs.getFloat("credit"));
        return userDTO;
    }
}

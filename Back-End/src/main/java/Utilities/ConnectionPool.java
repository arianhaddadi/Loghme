package Utilities;

import org.apache.commons.dbcp.BasicDataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class ConnectionPool {
    private static String DATABASE_NAME = "loghme";
    private static String DATABASE_URL = "localhost:3306";
    private static String DATABASE_USERNAME = "root";
    private static String DATABASE_PASSWORD = "loghme";
    private static ConnectionPool instance;
    private BasicDataSource dataSource;

    private ConnectionPool() {
        dataSource = new BasicDataSource();
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        dataSource.setUrl("jdbc:mysql://" + DATABASE_URL + "?useSSL=false&allowPublicKeyRetrieval=true");
        dataSource.setUsername(DATABASE_USERNAME);
        dataSource.setPassword(DATABASE_PASSWORD);
        dataSource.setMinIdle(20);
        dataSource.setMaxIdle(100);
        dataSource.setMaxOpenPreparedStatements(100);
    }

    private void createDatabase() {
        try {
            Connection connection = getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(
            "CREATE DATABASE IF NOT EXISTS " + DATABASE_NAME + ";"
            );
            preparedStatement.executeUpdate();
            preparedStatement.close();
            preparedStatement = connection.prepareStatement(
                    "USE " + DATABASE_NAME + ";"
            );
            preparedStatement.executeUpdate();
            preparedStatement.close();
            connection.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

    }

    public static ConnectionPool getInstance() {
        if (instance == null) {
            instance = new ConnectionPool();
            instance.createDatabase();
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}

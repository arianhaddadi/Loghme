package Utilities;

import org.apache.commons.dbcp.BasicDataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class ConnectionPool {
    private static final String DATABASE_NAME = "loghme";
    private static final String DATABASE_URL = "localhost:3306";
    private static final String DATABASE_USERNAME = "root";
    private static final String DATABASE_PASSWORD = "loghme";
    private static final String JDBC_DRIVER_CLASSNAME = "com.mysql.cj.jdbc.Driver";
    private static ConnectionPool instance;
    private BasicDataSource dataSource;

    private ConnectionPool() {
        loadDatabaseDriver();
        createDatabase();
        dataSource = new BasicDataSource();
        dataSource.setDriverClassName(JDBC_DRIVER_CLASSNAME);
        dataSource.setUrl("jdbc:mysql://" + DATABASE_URL + "/" + DATABASE_NAME + "?useSSL=false&allowPublicKeyRetrieval=true");
        dataSource.setUsername(DATABASE_USERNAME);
        dataSource.setPassword(DATABASE_PASSWORD);
        dataSource.setMinIdle(20);
        dataSource.setMaxIdle(100);
        dataSource.setMaxOpenPreparedStatements(100);
    }

    private void loadDatabaseDriver() {
        try {
            Class.forName(JDBC_DRIVER_CLASSNAME);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    private void createDatabase() {
        try {
            dataSource = new BasicDataSource();
            dataSource.setDriverClassName(JDBC_DRIVER_CLASSNAME);
            dataSource.setUrl("jdbc:mysql://" + DATABASE_URL + "?useSSL=false&allowPublicKeyRetrieval=true");
            dataSource.setUsername(DATABASE_USERNAME);
            dataSource.setPassword(DATABASE_PASSWORD);

            Connection connection = getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(
            "CREATE DATABASE IF NOT EXISTS " + DATABASE_NAME + ";"
            );
            preparedStatement.executeUpdate();
            preparedStatement.close();
//            preparedStatement = connection.prepareStatement(
//                    "USE " + DATABASE_NAME + ";"
//            );
//            preparedStatement.executeUpdate();
//            preparedStatement.close();
            connection.close();
            dataSource.close();
        } catch (SQLException e) {
            e.printStackTrace();
        }

    }

    public static ConnectionPool getInstance() {
        if (instance == null) {
            instance = new ConnectionPool();
        }
        return instance;
    }

    public Connection getConnection() throws SQLException {
        return dataSource.getConnection();
    }
}

package Utilities;

import org.apache.commons.dbcp.BasicDataSource;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;

public class ConnectionPool {
    private static ConnectionPool instance;
    private BasicDataSource dataSource;

    private ConnectionPool() {
        loadDatabaseDriver();
        createDatabase();
        dataSource = new BasicDataSource();
        dataSource.setDriverClassName(Configs.JDBC_DRIVER_CLASSNAME);
        dataSource.setUrl(Configs.DATABASE_URL + "/" + Configs.DATABASE_NAME + "?useSSL=false&allowPublicKeyRetrieval=true");
        dataSource.setUsername(Configs.DATABASE_USERNAME);
        dataSource.setPassword(Configs.DATABASE_PASSWORD);
        dataSource.setMinIdle(20);
        dataSource.setMaxIdle(100);
        dataSource.setMaxOpenPreparedStatements(100);
    }

    private void loadDatabaseDriver() {
        try {
            Class.forName(Configs.JDBC_DRIVER_CLASSNAME);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }
    }

    private void createDatabase() {
        try {
            dataSource = new BasicDataSource();
            dataSource.setDriverClassName(Configs.JDBC_DRIVER_CLASSNAME);
            dataSource.setUrl(Configs.DATABASE_URL + "?useSSL=false&allowPublicKeyRetrieval=true");
            dataSource.setUsername(Configs.DATABASE_USERNAME);
            dataSource.setPassword(Configs.DATABASE_PASSWORD);

            Connection connection = getConnection();
            PreparedStatement preparedStatement = connection.prepareStatement(
            "CREATE DATABASE IF NOT EXISTS " + Configs.DATABASE_NAME + ";"
            );
            preparedStatement.executeUpdate();
            preparedStatement.close();
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

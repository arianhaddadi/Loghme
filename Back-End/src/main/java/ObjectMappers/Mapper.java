package ObjectMappers;

import Utilities.ConnectionPool;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;

public abstract class Mapper<T, I> implements IMapper<T, I> {

    protected abstract PreparedStatement getFindStatement(I id, Connection connection)
            throws SQLException;

    protected abstract PreparedStatement getInsertStatement(T obj, Connection connection)
            throws SQLException;

    protected abstract PreparedStatement getDeleteStatement(I id, Connection connection)
            throws SQLException;

    protected abstract PreparedStatement getUpdateStatement(T obj, Connection connection)
            throws SQLException;

    protected abstract PreparedStatement getFindAllStatement(
            I id, Connection connection, Integer limitStart, Integer limitSize) throws SQLException;

    protected abstract T convertResultSetToObject(ResultSet rs) throws SQLException;

    public T find(I id) {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = getFindStatement(id, connection);
            ResultSet resultSet = preparedStatement.executeQuery();
            T obj;
            if (resultSet.next()) {
                obj = convertResultSetToObject(resultSet);
            } else {
                obj = null;
            }
            resultSet.close();
            preparedStatement.close();
            connection.close();
            return obj;
        } catch (SQLException e) {
            System.out.println("error in Mapper.findByID query.");
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public void insert(T obj) {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = getInsertStatement(obj, connection);
            preparedStatement.executeUpdate();
            preparedStatement.close();
            connection.close();
        } catch (SQLException e) {
            System.out.println("error in Mapper.insert query.");
            e.printStackTrace();
        }
    }

    @Override
    public void delete(I id) {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = getDeleteStatement(id, connection);
            preparedStatement.executeUpdate();
            preparedStatement.close();
            connection.close();
        } catch (SQLException e) {
            System.out.println("error in Mapper.delete query.");
            e.printStackTrace();
        }
    }

    @Override
    public ArrayList<T> findAll(I id, Integer limitStart, Integer limitSize) {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement =
                    getFindAllStatement(id, connection, limitStart, limitSize);
            ResultSet resultSet = preparedStatement.executeQuery();
            ArrayList<T> allItems = new ArrayList<>();
            while (resultSet.next()) {
                allItems.add(convertResultSetToObject(resultSet));
            }
            resultSet.close();
            preparedStatement.close();
            connection.close();
            return allItems;
        } catch (SQLException e) {
            System.out.println("error in Mapper.findAll query.");
            e.printStackTrace();
            return null;
        }
    }

    @Override
    public void update(T obj) {
        try {
            Connection connection = ConnectionPool.getInstance().getConnection();
            PreparedStatement preparedStatement = getUpdateStatement(obj, connection);
            preparedStatement.executeUpdate();
            preparedStatement.close();
            connection.close();
        } catch (SQLException e) {
            System.out.println("error in Mapper.update query.");
            e.printStackTrace();
        }
    }
}

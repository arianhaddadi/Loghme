package Mappers;

import java.sql.SQLException;
import java.util.ArrayList;


public interface IMapper<T, I> {
    T find(I id) throws SQLException;
    void insert(T t) throws SQLException;
    void delete(I id) throws SQLException;
    ArrayList<T> findAll(I id, Integer limitStart, Integer limitSize);
}

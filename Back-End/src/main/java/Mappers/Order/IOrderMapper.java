package Mappers.Order;

import Domain.Order.OrderDAO;
import Mappers.IMapper;

public interface IOrderMapper extends IMapper<OrderDAO, String> {
    int getCount();
}

package ObjectMappers.Order;

import Domain.DatabaseDTOs.OrderDTO;
import ObjectMappers.IMapper;

public interface IOrderMapper extends IMapper<OrderDTO, String> {
    int getCount();
}

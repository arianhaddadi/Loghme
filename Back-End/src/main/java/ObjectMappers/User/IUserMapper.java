package ObjectMappers.User;

import Domain.DatabaseDTOs.UserDTO;
import ObjectMappers.IMapper;

public interface IUserMapper extends IMapper<UserDTO, String> {
    UserDTO findUserByEmailAndPassword(String email, String password);
}

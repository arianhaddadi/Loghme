package Mappers.User;

import Domain.User.UserDAO;
import Mappers.IMapper;

public interface IUserMapper extends IMapper<UserDAO, String> {
    UserDAO findUserByEmailAndPassword(String email, String password);
}

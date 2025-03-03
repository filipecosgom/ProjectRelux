package aor.paj.bean;

import java.io.Serializable;
import java.security.SecureRandom;
import java.util.Base64;

import aor.paj.dao.UserDao;
import aor.paj.dto.UserDto;
import aor.paj.entity.UserEntity;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;

@Stateless
public class UserBean implements Serializable {

    @EJB //injeção de dependência- neste caso significa que a variável abaixo vai ser injetada automaticamente no container
    UserDao userDao;

    public String loginUser(UserDto user) {
        UserEntity userEntity = userDao.findUserByUsername(user.getUsername());
        if (userEntity != null) {
                if(userEntity.getPassword().equals(user.getPassword())) {
                    String token = generateNewToken();
                    userEntity.setToken(token);
                    return token;
                }
            }
        return null;
    }

    public boolean registerUser(UserDto user) {
        UserEntity u_temp = userDao.findUserByUsername(user.getUsername());
        if (u_temp == null) {
            UserEntity userEntity = convertUserDtotoUserEntity(user);
            try {
                userDao.persist(userEntity);
            }
            catch(Exception e) {
                System.out.println(e.getMessage());
            }

            return true;
        } else {
            throw new RuntimeException("Já existe um utilizador com esse username");
        }
    }

    private UserEntity convertUserDtotoUserEntity(UserDto user) {
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(user.getUsername());
        userEntity.setPassword(user.getPassword());
        userEntity.setName(user.getFirstName());
        userEntity.setEmail(user.getEmail());
        userEntity.setPhone(user.getPhone());
        userEntity.setImagem(user.getImagem());
        userEntity.setIsAdmin(user.getIsAdmin());
        return userEntity;
    }

    private String generateNewToken() {
        SecureRandom secureRandom = new SecureRandom();
        Base64.Encoder base64Encoder = Base64.getUrlEncoder();
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
    }

    public boolean tokenExist(String token){
        if (userDao.findByToken(token) != null)
            return true;
        return false;

    }
    public boolean updateUser(UserDto userDto) {
        UserEntity userEntity = userDao.findUserByUsername(userDto.getUsername());
        if (userEntity != null) {
            userEntity.setPassword(userDto.getPassword());
            userEntity.setName(userDto.getFirstName());
            userEntity.setEmail(userDto.getEmail());
            userEntity.setPhone(userDto.getPhone());
            userEntity.setImagem(userDto.getImagem());
            userEntity.setIsAdmin(userDto.getIsAdmin());
            userDao.merge(userEntity);
            return true;
        }
        return false;
    }
//    public UserDto getUserByUsername(String username) {
//        UserDto userDto = users.get(username);
//        if (userDto == null) {
//            throw new RuntimeException("Utilizador não encontrado!");
//        }
//        return userDto;
//    }
/*
    public void deleteUserByUsername(String username) {
        if (!users.containsKey(username)) {
            throw new RuntimeException("User not found");
        }
        users.remove(username);
        //saveUsersToFile();
    }

    public boolean checkUsernameExists(String username) {
        return users.containsKey(username);
    }


    }*/
}

package aor.paj.bean;

import java.io.Serializable;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

import aor.paj.dao.UserDao;
import aor.paj.dto.UserDto;
import aor.paj.entity.UserEntity;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.enterprise.context.ApplicationScoped;

@Stateless
public class UserBean implements Serializable {

    @EJB //injeção de dependência- neste caso significa que a variável abaixo vai ser injetada automaticamente no container
    UserDao userDao;

    public String loginUser(String token) {
        UserEntity userEntity = userDao.findUserByToken(token);

        if (userEntity != null) {
                return token;
            }
        throw new RuntimeException("Token inválido!");
    }

    public boolean registerUser(UserDto user) {
        UserEntity u_temp = userDao.findUserByUsername(user.getUsername());
        if (u_temp == null) {
            userDao.persist(convertUserDtotoUserEntity(user));
            return true;
        } else {
            throw new RuntimeException("Já existe um utilizador com esse username");
        }
    }

    private UserEntity convertUserDtotoUserEntity(UserDto user) {
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(user.getUsername());
        userEntity.setPassword(user.getPassword());
        userEntity.setEmail(user.getEmail());
        userEntity.setNome(user.getNome());
        return userEntity;
    }

    private String generateNewToken() {
        SecureRandom secureRandom = new SecureRandom(); //threadsafe
        Base64.Encoder base64Encoder = Base64.getUrlEncoder(); //threadsafe
        byte[] randomBytes = new byte[24];
        secureRandom.nextBytes(randomBytes);
        return base64Encoder.encodeToString(randomBytes);
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

    public UserDto updateUser(String username, UserDto updatedUser) {
        UserDto existingUser = users.get(username);
        if (existingUser == null) {
            throw new RuntimeException("Utilizador não encontrado.");
        }
        existingUser.setNome(updatedUser.getNome());
        existingUser.setEmail(updatedUser.getEmail());
        existingUser.setTelefone(updatedUser.getTelefone());
        existingUser.setImagem(updatedUser.getImagem());
        if (updatedUser.getPassword() != null) {
            existingUser.setPassword(updatedUser.getPassword());
        }
        users.put(username, existingUser);
        // saveUsersToFile();
        return existingUser;
    }*/
}

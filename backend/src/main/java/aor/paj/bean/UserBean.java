package aor.paj.bean;

import java.io.Serializable;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

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
                    userDao.merge(userEntity);
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
    public List<UserDto> getAllUsers() {
        List<UserEntity> users = userDao.findAll();
        return convertUserEntityListToUserDtoList(users);
    }


    private UserEntity convertUserDtotoUserEntity(UserDto user) {
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(user.getUsername());
        userEntity.setPassword(user.getPassword());
        userEntity.setFirstName(user.getFirstName());
        userEntity.setLastName(user.getLastName());
        userEntity.setEmail(user.getEmail());
        userEntity.setPhone(user.getPhone());
        userEntity.setImagem(user.getImagem());
        userEntity.setIsAdmin(user.getIsAdmin());
        userEntity.setDeleted(user.getIsDeleted());
        return userEntity;
    }
    public UserDto convertUserEntityToUserDto(UserEntity user) {
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setPassword(user.getPassword());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setPhone(user.getPhone());
        userDto.setImagem(user.getImagem());
        userDto.setAdmin(user.isAdmin());
        userDto.setId(user.getId());
        userDto.setDeleted(user.isDeleted());
        return userDto;
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
            userEntity.setFirstName(userDto.getFirstName());
            userEntity.setLastName(userDto.getLastName());
            userEntity.setEmail(userDto.getEmail());
            userEntity.setPhone(userDto.getPhone());
            userEntity.setImagem(userDto.getImagem());
            userEntity.setIsAdmin(userDto.getIsAdmin());
            userEntity.setDeleted(userDto.getIsDeleted());
            userDao.merge(userEntity);
            return true;
        }
        return false;
    }

    public UserEntity getUserByToken(String token) {
        return userDao.findByToken(token);
    }

    public boolean logoutUser(String token) {
        UserEntity userEntity = userDao.findByToken(token);
        if (userEntity != null) {
            userEntity.setToken(null);
            userDao.merge(userEntity);
            return true;
        }
        return false;
    }
    public boolean deleteUser(String username) {
        UserEntity userEntity = userDao.findUserByUsername(username);
        if (userEntity != null) {
            userDao.remove(userEntity);
            return true;
        }
        return false;
    }

    public boolean softDeleteUser(String username) {
        UserEntity userEntity = userDao.findUserByUsername(username);
        if (userEntity != null) {
            userEntity.setDeleted(true); // Supondo que você tem um campo isDeleted para soft delete
            userDao.merge(userEntity);
            return true;
        }
        return false;
    }
    public UserEntity getUserByUsername(String username) {
        return userDao.findUserByUsername(username);
    }

    public List<UserDto> getDeletedUsers() {
        List<UserEntity> users = userDao.findDeletedUsers();
        return convertUserEntityListToUserDtoList(users);
    }
    private List<UserDto> convertUserEntityListToUserDtoList(List<UserEntity> userEntities) {
        List<UserDto> userDtos = new ArrayList<>();
        for (UserEntity userEntity : userEntities) {
            userDtos.add(convertUserEntityToUserDto(userEntity));
        }
        return userDtos;
    }


}

package aor.paj.bean;

import aor.paj.dao.ProductDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.UserDto;
import aor.paj.entity.ProductEntity;
import aor.paj.entity.UserEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class UserBeanTest {

    @InjectMocks
    private UserBean userBean;

    @Mock
    private UserDao userDao;

    @Mock
    private ProductDao productDao;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testLoginUser_SuccessfulLogin_ReturnsToken() {
        // Arrange
        UserDto userDto = new UserDto();
        userDto.setUsername("testUser");
        userDto.setPassword("password");

        UserEntity userEntity = new UserEntity();
        userEntity.setUsername("testUser");
        userEntity.setPassword("password");

        when(userDao.findUserByUsername(userDto.getUsername())).thenReturn(userEntity);

        // Act
        String token = userBean.loginUser(userDto);

        // Assert
        assertNotNull(token);
        verify(userDao).merge(userEntity);
        assertNotNull(userEntity.getToken());
    }

    @Test
    public void testLoginUser_InvalidUsername_ReturnsNull() {
        // Arrange
        UserDto userDto = new UserDto();
        userDto.setUsername("testUser");
        userDto.setPassword("password");

        when(userDao.findUserByUsername(userDto.getUsername())).thenReturn(null);

        // Act
        String token = userBean.loginUser(userDto);

        // Assert
        assertNull(token);
        verify(userDao, never()).merge(any());
    }

    @Test
    public void testLoginUser_InvalidPassword_ReturnsNull() {
        // Arrange
        UserDto userDto = new UserDto();
        userDto.setUsername("testUser");
        userDto.setPassword("wrongPassword");

        UserEntity userEntity = new UserEntity();
        userEntity.setUsername("testUser");
        userEntity.setPassword("password");

        when(userDao.findUserByUsername(userDto.getUsername())).thenReturn(userEntity);

        // Act
        String token = userBean.loginUser(userDto);

        // Assert
        assertNull(token);
        verify(userDao, never()).merge(any());
    }

    @Test
    public void testRegisterUser_SuccessfulRegistration_ReturnsTrue() {
        // Arrange
        UserDto userDto = new UserDto();
        userDto.setUsername("testUser");
        userDto.setPassword("password");

        when(userDao.findUserByUsername(userDto.getUsername())).thenReturn(null);

        // Act
        boolean result = false;
        try {
            userBean.registerUser(userDto);
            result = true;
        } catch (Exception e) {
            // Log the exception for debugging purposes
            e.printStackTrace();
        }

        // Assert
        assertTrue(result);
        verify(userDao).persist(any(UserEntity.class));
    }

    @Test
    public void testRegisterUser_UsernameAlreadyExists_ThrowsException() {
        // Arrange
        UserDto userDto = new UserDto();
        userDto.setUsername("existingUser");
        userDto.setPassword("password");

        UserEntity existingUser = new UserEntity();
        existingUser.setUsername("existingUser");

        when(userDao.findUserByUsername(userDto.getUsername())).thenReturn(existingUser);

        // Act and Assert
        assertThrows(RuntimeException.class, () -> userBean.registerUser(userDto));
        verify(userDao, never()).persist(any());
    }

    @Test
    public void testGetAllUsers_ReturnsListOfUserDtos() {
        // Arrange
        List<UserEntity> userEntities = new ArrayList<>();
        UserEntity userEntity1 = new UserEntity();
        userEntity1.setUsername("user1");
        UserEntity userEntity2 = new UserEntity();
        userEntity2.setUsername("user2");
        userEntities.add(userEntity1);
        userEntities.add(userEntity2);

        when(userDao.findAll()).thenReturn(userEntities);

        // Act
        List<UserDto> userDtos = userBean.getAllUsers();

        // Assert
        assertEquals(2, userDtos.size());
        assertEquals("user1", userDtos.get(0).getUsername());
        assertEquals("user2", userDtos.get(1).getUsername());
    }

    @Test
    public void testGetAllUsers_NoUsersFound_ReturnsEmptyList() {
        // Arrange
        when(userDao.findAll()).thenReturn(new ArrayList<>());

        // Act
        List<UserDto> userDtos = userBean.getAllUsers();

        // Assert
        assertTrue(userDtos.isEmpty());
    }

    @Test
    public void testUpdateUser_SuccessfulUpdate_ReturnsTrue() {
        // Arrange
        UserDto userDto = new UserDto();
        userDto.setUsername("testUser");
        userDto.setFirstName("UpdatedFirstName");
        userDto.setLastName("UpdatedLastName");

        UserEntity userEntity = new UserEntity();
        userEntity.setUsername("testUser");
        userEntity.setFirstName("OriginalFirstName");
        userEntity.setLastName("OriginalLastName");

        when(userDao.findUserByUsername(userDto.getUsername())).thenReturn(userEntity);

        // Act
        boolean result = userBean.updateUser(userDto);

        // Assert
        assertTrue(result);
        assertEquals("UpdatedFirstName", userEntity.getFirstName());
        assertEquals("UpdatedLastName", userEntity.getLastName());
        verify(userDao).merge(userEntity);
    }

    @Test
    public void testUpdateUser_UserNotFound_ReturnsFalse() {
        // Arrange
        UserDto userDto = new UserDto();
        userDto.setUsername("testUser");
        userDto.setFirstName("UpdatedFirstName");

        when(userDao.findUserByUsername(userDto.getUsername())).thenReturn(null);

        // Act
        boolean result = userBean.updateUser(userDto);

        // Assert
        assertFalse(result);
        verify(userDao, never()).merge(any());
    }

    @Test
    public void testDeleteUser_SuccessfulDelete_ReturnsTrue() {
        // Arrange
        String username = "testUser";
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(username);
        List<ProductEntity> products = new ArrayList<>();
        ProductEntity product1 = new ProductEntity();
        product1.setTitle("Product 1");
        products.add(product1);
        userEntity.setProducts(products);

        when(userDao.findUserByUsername(username)).thenReturn(userEntity);

        // Act
        boolean result = userBean.deleteUser(username);

        // Assert
        assertTrue(result);
        verify(productDao).remove(product1);
        verify(userDao).remove(userEntity);
    }

    @Test
    public void testDeleteUser_UserNotFound_ReturnsFalse() {
        // Arrange
        String username = "testUser";
        when(userDao.findUserByUsername(username)).thenReturn(null);

        // Act
        boolean result = userBean.deleteUser(username);

        // Assert
        assertFalse(result);
        verify(productDao, never()).remove(any());
        verify(userDao, never()).remove(any());
    }


    @Test
    public void testSoftDeleteUser_SuccessfulSoftDelete_ReturnsTrue() {
        // Arrange
        String username = "testUser";
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(username);
        userEntity.setDeleted(false);

        when(userDao.findUserByUsername(username)).thenReturn(userEntity);

        // Act
        boolean result = userBean.softDeleteUser(username);

        // Assert
        assertTrue(result);
        assertTrue(userEntity.isDeleted());
        verify(userDao).merge(userEntity);
    }

    @Test
    public void testSoftDeleteUser_UserNotFound_ReturnsFalse() {
        // Arrange
        String username = "testUser";
        when(userDao.findUserByUsername(username)).thenReturn(null);

        // Act
        boolean result = userBean.softDeleteUser(username);

        // Assert
        assertFalse(result);
        verify(userDao, never()).merge(any());
    }

    @Test
    public void testGetUserByToken_ExistingToken_ReturnsUserEntity() {
        // Arrange
        String token = "validToken";
        UserEntity userEntity = new UserEntity();
        userEntity.setToken(token);

        when(userDao.findByToken(token)).thenReturn(userEntity);

        // Act
        UserEntity result = userBean.getUserByToken(token);

        // Assert
        assertEquals(userEntity, result);
    }

    @Test
    public void testGetUserByToken_InvalidToken_ReturnsNull() {
        // Arrange
        String token = "invalidToken";
        when(userDao.findByToken(token)).thenReturn(null);

        // Act
        UserEntity result = userBean.getUserByToken(token);

        // Assert
        assertNull(result);
    }

    @Test
    public void testLogoutUser_SuccessfulLogout_ReturnsTrue() {
        // Arrange
        String token = "validToken";
        UserEntity userEntity = new UserEntity();
        userEntity.setToken(token);

        when(userDao.findByToken(token)).thenReturn(userEntity);

        // Act
        boolean result = userBean.logoutUser(token);

        // Assert
        assertTrue(result);
        assertNull(userEntity.getToken());
        verify(userDao).merge(userEntity);
    }

    @Test
    public void testLogoutUser_UserNotFound_ReturnsFalse() {
        // Arrange
        String token = "invalidToken";
        when(userDao.findByToken(token)).thenReturn(null);

        // Act
        boolean result = userBean.logoutUser(token);

        // Assert
        assertFalse(result);
        verify(userDao, never()).merge(any());
    }

    @Test
    public void testGetUserByUsername_ExistingUsername_ReturnsUserEntity() {
        // Arrange
        String username = "testUser";
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername(username);

        when(userDao.findUserByUsername(username)).thenReturn(userEntity);

        // Act
        UserEntity result = userBean.getUserByUsername(username);

        // Assert
        assertEquals(userEntity, result);
    }

    @Test
    public void testGetUserByUsername_InvalidUsername_ReturnsNull() {
        // Arrange
        String username = "invalidUser";
        when(userDao.findUserByUsername(username)).thenReturn(null);

        // Act
        UserEntity result = userBean.getUserByUsername(username);

        // Assert
        assertNull(result);
    }

    @Test
    public void testGetDeletedUsers_ReturnsListOfUserDtos() {
        // Arrange
        List<UserEntity> userEntities = new ArrayList<>();
        UserEntity userEntity1 = new UserEntity();
        userEntity1.setUsername("user1");
        UserEntity userEntity2 = new UserEntity();
        userEntity2.setUsername("user2");
        userEntities.add(userEntity1);
        userEntities.add(userEntity2);

        when(userDao.findDeletedUsers()).thenReturn(userEntities);

        // Act
        List<UserDto> userDtos = userBean.getDeletedUsers();

        // Assert
        assertEquals(2, userDtos.size());
        assertEquals("user1", userDtos.get(0).getUsername());
        assertEquals("user2", userDtos.get(1).getUsername());
    }

    @Test
    public void testGetDeletedUsers_NoUsersFound_ReturnsEmptyList() {
        // Arrange
        when(userDao.findDeletedUsers()).thenReturn(new ArrayList<>());

        // Act
        List<UserDto> userDtos = userBean.getDeletedUsers();

        // Assert
        assertTrue(userDtos.isEmpty());
    }
    @Test
    public void testConvertUserDtotoUserEntity() {
        // Arrange
        UserDto userDto = new UserDto();
        userDto.setUsername("testUser");
        userDto.setPassword("password");
        userDto.setFirstName("FirstName");
        userDto.setLastName("LastName");
        userDto.setEmail("test@example.com");
        userDto.setPhone("123-456-7890");

        // Act
        UserEntity userEntity = userBean.convertUserDtotoUserEntity(userDto);

        // Assert
        assertEquals("testUser", userEntity.getUsername());
        assertEquals("password", userEntity.getPassword());
        assertEquals("FirstName", userEntity.getFirstName());
        assertEquals("LastName", userEntity.getLastName());
        assertEquals("test@example.com", userEntity.getEmail());
        assertEquals("123-456-7890", userEntity.getPhone());
    }

    @Test
    public void testConvertUserEntityToUserDto() {
        // Arrange
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername("testUser");
        userEntity.setPassword("password");
        userEntity.setFirstName("FirstName");
        userEntity.setLastName("LastName");
        userEntity.setEmail("test@example.com");
        userEntity.setPhone("123-456-7890");

        // Act
        UserDto userDto = userBean.convertUserEntityToUserDto(userEntity);

        // Assert
        assertEquals("testUser", userDto.getUsername());
        assertEquals("password", userDto.getPassword());
        assertEquals("FirstName", userDto.getFirstName());
        assertEquals("LastName", userDto.getLastName());
        assertEquals("test@example.com", userDto.getEmail());
        assertEquals("123-456-7890", userDto.getPhone());
    }
}

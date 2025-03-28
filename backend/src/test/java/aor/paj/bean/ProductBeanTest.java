package aor.paj.bean;

import aor.paj.dao.CategoryDao;
import aor.paj.dao.ProductDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.EstadosDoProduto;
import aor.paj.dto.ProductDto;
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

public class ProductBeanTest {

    @InjectMocks
    private ProductBean productBean;

    @Mock
    private ProductDao productDao;

    @Mock
    private UserDao userDao;

    @Mock
    private CategoryDao categoryDao;

    @Mock
    private CategoryBean categoryBean;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testAddProduct_UserNotFound() {
        // Arrange
        String token = "invalidToken";
        ProductDto productDto = new ProductDto();
        productDto.setTitle("Test Product");

        when(userDao.findByToken(token)).thenReturn(null);

        // Act
        boolean result = productBean.addProduct(token, productDto);

        // Assert
        assertFalse(result);
        verify(productDao, never()).persist(any(ProductEntity.class));
    }

    @Test
    public void testGetAllProducts_NoProductsFound_ReturnsEmptyList() {
        // Arrange
        when(productDao.findAll()).thenReturn(new ArrayList<>());

        // Act
        List<ProductDto> productDtos = productBean.getAllProducts();

        // Assert
        assertTrue(productDtos.isEmpty());
    }



    @Test
    public void testGetProductById_NonExistingId_ReturnsNull() {
        // Arrange
        int productId = 999;
        when(productDao.findById(productId)).thenReturn(null);

        // Act
        ProductDto productDto = productBean.getProductById(productId);

        // Assert
        assertNull(productDto);
    }

    @Test
    public void testGetProductsByUser_NoProductsFound_ReturnsEmptyList() {
        // Arrange
        UserEntity userEntity = new UserEntity();
        userEntity.setUsername("testUser");
        when(productDao.findProductByUser(userEntity)).thenReturn(new ArrayList<>());

        // Act
        List<ProductDto> productDtos = productBean.getProductsByUser(userEntity);

        // Assert
        assertTrue(productDtos.isEmpty());
    }



    @Test
    public void testUpdateProduct_NonExistingProduct_ReturnsFalse() {
        // Arrange
        int productId = 999;
        ProductDto productDto = new ProductDto();
        productDto.setTitle("Updated Product");
        when(productDao.findById(productId)).thenReturn(null);

        // Act
        boolean result = productBean.updateProduct(productId, productDto);

        // Assert
        assertFalse(result);
        verify(productDao, never()).merge(any());
    }

    @Test
    public void testDeleteProduct_ExistingProduct_ReturnsTrue() {
        // Arrange
        int productId = 1;
        ProductEntity productEntity = new ProductEntity();
        when(productDao.findById(productId)).thenReturn(productEntity);

        // Act
        boolean result = productBean.deleteProduct(productId);

        // Assert
        assertTrue(result);
        verify(productDao).remove(productEntity);
    }

    @Test
    public void testDeleteProduct_NonExistingProduct_ReturnsFalse() {
        // Arrange
        int productId = 999;
        when(productDao.findById(productId)).thenReturn(null);

        // Act
        boolean result = productBean.deleteProduct(productId);

        // Assert
        assertFalse(result);
        verify(productDao, never()).remove(any());
    }

    @Test
    public void testSoftDeleteProduct_ExistingProduct_ReturnsTrue() {
        // Arrange
        int productId = 1;
        ProductEntity productEntity = new ProductEntity();
        productEntity.setState(EstadosDoProduto.DISPONIVEL); // Estado inicial
        when(productDao.findById(productId)).thenReturn(productEntity);

        // Act
        boolean result = productBean.softDeleteProduct(productId);

        // Assert
        assertTrue(result);
        assertEquals(EstadosDoProduto.APAGADO, productEntity.getState()); // Verifica se o estado foi atualizado
        verify(productDao).merge(productEntity);
    }

    @Test
    public void testSoftDeleteProduct_NonExistingProduct_ReturnsFalse() {
        // Arrange
        int productId = 999;
        when(productDao.findById(productId)).thenReturn(null);

        // Act
        boolean result = productBean.softDeleteProduct(productId);

        // Assert
        assertFalse(result);
        verify(productDao, never()).merge(any());
    }

    @Test
    public void testUpdateProductState_ExistingProduct_ReturnsTrue() {
        // Arrange
        int productId = 1;
        ProductEntity productEntity = new ProductEntity();
        productEntity.setState(EstadosDoProduto.DISPONIVEL); // Estado inicial
        when(productDao.findById(productId)).thenReturn(productEntity);

        // Act
        boolean result = productBean.updateProductState(productId, EstadosDoProduto.COMPRADO);

        // Assert
        assertTrue(result);
        assertEquals(EstadosDoProduto.COMPRADO, productEntity.getState()); // Verifica se o estado foi atualizado
        verify(productDao).merge(productEntity);
    }

    @Test
    public void testUpdateProductState_NonExistingProduct_ReturnsFalse() {
        // Arrange
        int productId = 999;
        when(productDao.findById(productId)).thenReturn(null);

        // Act
        boolean result = productBean.updateProductState(productId, EstadosDoProduto.COMPRADO);

        // Assert
        assertFalse(result);
        verify(productDao, never()).merge(any());
    }

    @Test
    public void testGetProductsByCategory_NoProductsFound_ReturnsEmptyList() {
        // Arrange
        int categoryId = 1;
        when(productDao.findProductByCategory(categoryId)).thenReturn(new ArrayList<>());

        // Act
        List<ProductDto> productDtos = productBean.getProductsByCategory(categoryId);

        // Assert
        assertTrue(productDtos.isEmpty());
    }

    @Test
    public void testGetDeletedProducts_NoProductsFound_ReturnsEmptyList() {
        // Arrange
        when(productDao.findDeletedProducts()).thenReturn(new ArrayList<>());

        // Act
        List<ProductDto> productDtos = productBean.getDeletedProducts();

        // Assert
        assertTrue(productDtos.isEmpty());
    }


}

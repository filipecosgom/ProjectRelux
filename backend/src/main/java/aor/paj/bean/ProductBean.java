package aor.paj.bean;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

import aor.paj.dao.CategoryDao;
import aor.paj.dao.ProductDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.EstadosDoProduto;
import aor.paj.dto.ProductDto;
import aor.paj.entity.ProductEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;

@Stateless
public class ProductBean implements Serializable {
    private static final long serialVersionUID = 1L;
    // private static final Logger logger= LogManager.getLogger(ProductBean.class);
    @EJB
    ProductDao productDao;
    @EJB
    UserDao userDao;
    @EJB
    CategoryDao categoryDao;
    @EJB
    private CategoryBean categoryBean;


    @Inject
    public ProductBean(final ProductDao productDao, final UserDao userDao, final CategoryDao categoryDao) {
        this.productDao = productDao;
        this.userDao = userDao;
        this.categoryDao = categoryDao;
    }

    public ProductBean() {
    }

    public boolean addProduct(String token, ProductDto p) {
        UserEntity userEntity = userDao.findByToken(token);

        if (userEntity != null) {
            ProductEntity productEntity = convertProductDtoToProductEntity(p);
            productEntity.setUserAutor(userEntity);
            productDao.persist(productEntity);
            return true;
        }
        return false;
    }

    public List<ProductDto> getAllProducts() {
        List<ProductEntity> products = productDao.findAll();
        return convertProductEntityListtoProductDtoList(products);
    }

    public ProductDto getProductById(int id) {
        ProductEntity p = productDao.findById(id);
        if (p != null) {
            return convertProductEntityToProductDto(p);
        }
        return null;
    }

    public List<ProductDto> getProductsByUser(UserEntity userEntity) {
        List<ProductEntity> products = productDao.findProductByUser(userEntity);
        return convertProductEntityListtoProductDtoList(products);
    }

    public boolean updateProduct(int id, ProductDto productDto) {
        ProductEntity productEntity = productDao.findById(id);
        if (productEntity != null) {
            productEntity.setTitle(productDto.getTitle());
            productEntity.setCategory(categoryBean.convertCategoryDtoToCategoryEntity(productDto.getCategory()));
            productEntity.setPrice(productDto.getPrice());
            productEntity.setImagem(productDto.getImagem());
            productEntity.setLocal(productDto.getLocal());
            productEntity.setDescription(productDto.getDescription());
            productEntity.setPostDate(productDto.getPostDate());
            productEntity.setState(productDto.getState());
            productDao.merge(productEntity);
            return true;
        }
        return false;
    }

    public boolean deleteProduct(int id) {
        ProductEntity productEntity = productDao.findById(id);
        if (productEntity != null) {
            productDao.remove(productEntity);
            return true;
        }
        return false;
    }

    public boolean softDeleteProduct(int id) {
        ProductEntity productEntity = productDao.findById(id);
        if (productEntity != null) {
            productEntity.setState(EstadosDoProduto.APAGADO);
            productDao.merge(productEntity);
            return true;
        }
        return false;
    }

    public boolean updateProductState(int id, EstadosDoProduto state) {
        ProductEntity productEntity = productDao.findById(id);
        if (productEntity != null) {
            productEntity.setState(state);
            productDao.merge(productEntity);
            return true;
        }
        return false;
    }

    public List<ProductDto> getProductsByCategory(int categoryId) {
        List<ProductEntity> products = productDao.findProductByCategory(categoryId);
        return convertProductEntityListtoProductDtoList(products);
    }


    private ProductEntity convertProductDtoToProductEntity(ProductDto a) {
        ProductEntity productEntity = new ProductEntity();
        productEntity.setTitle(a.getTitle());
        productEntity.setDescription(a.getDescription());
        productEntity.setPrice(a.getPrice());
        productEntity.setImagem(a.getImagem());
        productEntity.setLocal(a.getLocal());
        productEntity.setPostDate(a.getPostDate());
        productEntity.setState(a.getState());
        productEntity.setCategory(categoryBean.convertCategoryDtoToCategoryEntity(a.getCategory()));

        return productEntity;
    }


    private List<ProductDto> convertProductEntityListtoProductDtoList(List<ProductEntity> productEntity) {
        List<ProductDto> productDtos = new ArrayList<>();
        for (ProductEntity a : productEntity) {
            productDtos.add(convertProductEntityToProductDto(a));
        }
        return productDtos;
    }

    private ProductDto convertProductEntityToProductDto(ProductEntity a) {
        ProductDto productDto = new ProductDto();
        productDto.setTitle(a.getTitle());
        productDto.setDescription(a.getDescription());
        productDto.setId(a.getId());
        productDto.setUserAutor(a.getUserAutor().getUsername());
        productDto.setPrice(a.getPrice());
        productDto.setImagem(a.getImagem());
        productDto.setLocal(a.getLocal());
        productDto.setPostDate(a.getPostDate());
        productDto.setState(a.getState());
        productDto.setCategory(categoryBean.convertCategoryEntityToCategoryDto(a.getCategory()));
        return productDto;

    }


}



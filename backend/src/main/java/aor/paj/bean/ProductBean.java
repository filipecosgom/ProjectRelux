package aor.paj.bean;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

import aor.paj.dao.CategoryDao;
import aor.paj.dao.ProductDao;
import aor.paj.dao.UserDao;
import aor.paj.dto.ProductDto;
import aor.paj.entity.ProductEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;

@Stateless
public class ProductBean  implements Serializable {
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
        UserEntity userEntity= userDao.findByToken(token);

        if(userEntity != null) {
            ProductEntity productEntity = convertProductDtoToProductEntity(p);
            productEntity.setUserAutor(userEntity);
            productDao.persist(productEntity);
            return true;
        }
        return false;
    }

    public List<ProductDto> getAllProducts(String token) {
        UserEntity userEntity = userDao.findByToken(token);
        if (userEntity != null) {
            List<ProductEntity> products = productDao.findProductByUser(userEntity);
            if (products != null)
                return convertProductEntityListtoProductDtoList(products);
        }
        return new ArrayList<>();
    }

    public ProductDto getProductById(String id) {
        ProductEntity p = productDao.findById(Integer.parseInt(id));
        if (p  != null) {
            return convertProductEntityToProductDto(p);
        }
        return null;
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
//
//    public void addProduct(ProductDto product) {
//        productMap.put(product.getId(), product);
//
//    }
//
//    public void updateProduct(ProductDto productDto) {
//        if (productMap.containsKey(productDto.getId())) {
//            ProductDto existingProduct = productMap.get(productDto.getId());
//
//            if (productDto.getTitulo() != null) {
//                existingProduct.setTitulo(productDto.getTitulo());
//            }
//            if (productDto.getCategoria() != null) {
//                existingProduct.setCategoria(productDto.getCategoria());
//            }
//            if (productDto.getPreco() != 0) {
//                existingProduct.setPreco(productDto.getPreco());
//            }
//            if (productDto.getImagem() != null) {
//                existingProduct.setImagem(productDto.getImagem());
//            }
//            if (productDto.getLocal() != null) {
//                existingProduct.setLocal(productDto.getLocal());
//            }
//            if (productDto.getDescricao() != null) {
//                existingProduct.setDescricao(productDto.getDescricao());
//            }
//            if (productDto.getDataDePublicacao() != null) {
//                existingProduct.setDataDePublicacao(productDto.getDataDePublicacao());
//            }
//            if (productDto.getUserAutor() != null) {
//                existingProduct.setUserAutor(productDto.getUserAutor());
//            }
//
//            if (productDto.getEstado() != null) {
//                existingProduct.setEstado(productDto.getEstado());
//            }
//
//
//        } else {
//            throw new IllegalArgumentException("Product not found with id: " + productDto.getId());
//        }
//    }
//
//    public void deleteProduct(String id) {
//        productMap.remove(id);
//
//    }
//
//    public List<ProductDto> getAllProducts() {
//        return new ArrayList<>(productMap.values());
//    }
//


package aor.paj.bean;

import java.io.*;
import java.util.ArrayList;

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
   // private static final Logger logger= LogManager.getLogger(ProductBean.class);
   ProductDao productDao;
    UserDao userDao;
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

    public ArrayList<ProductDto> getAllProducts(String token) {
        UserEntity userEntity = userDao.findByToken(token);
        if (userEntity != null) {
            ArrayList<ProductEntity> products = ProductDao.findProductByUser(userEntity);
            if (products != null)
                return convertProductDtoToProductEntity();
        }
        return null;
    }


    private ArrayList<ProductDto> convertProductEntityListtoProductDtoList(ArrayList<ProductEntity> productEntity) {
        ArrayList<ProductDto> productDtos = new ArrayList<ProductDto>();
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
        productDto.setUserAutor(a.getUserAutor());
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

}
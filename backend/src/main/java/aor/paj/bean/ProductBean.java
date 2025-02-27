//package aor.paj.bean;
//
//import java.io.*;
//import java.lang.reflect.Type;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.logging.LogManager;
//
//import aor.paj.dto.ProductDto;
//import aor.paj.entity.UserEntity;
//import jakarta.annotation.PostConstruct;
//import jakarta.ejb.Stateless;
//import jakarta.enterprise.context.ApplicationScoped;
//import jakarta.inject.Inject;
//import jakarta.json.bind.Jsonb;
//import jakarta.json.bind.JsonbBuilder;
//import jakarta.persistence.PersistenceContext;
////import org.apache.logging.log4j.LogManager;
////import org.apache.logging.log4j.Logger;
//
//@Stateless
//public class ProductBean  implements Serializable {
//
//    //    private static final Logger logger= LogManager.getLogger(ProductBean.class);
//    ProductBean productBean;
//    UserBean userBean;
//    CategoryBean categoryBean;
//
//
//    @Inject
//    public ProductBean(final ProductBean productBean, final UserBean userBean, final CategoryBean categoryBean) {
//        this.productBean = productBean;
//        this.userBean = userBean;
//        this.categoryBean = categoryBean;
//    }
//
//    public ProductBean() {
//    }
//
//    public boolean addProduct(String token, ProductDto p) {
//        UserEntity userEntity = userDao.findUserByToken(token);
//    }
//
//    public ProductDto getProductById(String id) {
//        return em.find(ProductDto.class, id);
//    }
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
//}
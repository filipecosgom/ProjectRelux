package aor.paj.dao;

import aor.paj.entity.ProductEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;

import java.util.List;

@Stateless
public class ProductDao extends AbstratDao<ProductEntity> {

    private static final long serialVersionUID = 1L;


    public ProductDao() {
        super(ProductEntity.class);
    }

    public ProductEntity findById(int id) {
        try{
            return (ProductEntity) em.createNamedQuery("Product.findProductsById").setParameter("id", id).getSingleResult();
        }
        catch (NoResultException e){
            return null;
        }
    }
    public List<ProductEntity> findProductByUser(UserEntity userEntity) {
        try {
            return em.createNamedQuery("Product.findProductByUser", ProductEntity.class).setParameter("owner", userEntity).getResultList();
        } catch (Exception e) {
            return null;
        }
    }

    public void remove(ProductEntity productEntity) {
        em.remove(em.contains(productEntity) ? productEntity : em.merge(productEntity));
    }
}



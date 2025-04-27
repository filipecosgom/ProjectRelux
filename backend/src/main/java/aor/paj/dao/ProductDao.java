package aor.paj.dao;

import aor.paj.dto.EstadosDoProduto;
import aor.paj.dto.TimeSeriesDto;
import aor.paj.entity.ProductEntity;
import aor.paj.entity.UserEntity;
import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Stateless
public class ProductDao extends AbstratDao<ProductEntity> {

    private static final long serialVersionUID = 1L;


    public ProductDao() {
        super(ProductEntity.class);
    }

    public ProductEntity findById(int id) {
        try {
            return (ProductEntity) em.createNamedQuery("Product.findProductsById").setParameter("id", id).getSingleResult();
        } catch (NoResultException e) {
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

    public List<ProductEntity> findProductByCategory(int categoryId) {
        try {
            return em.createNamedQuery("Product.findProductByCategory", ProductEntity.class)
                    .setParameter("categoryId", categoryId)
                    .getResultList();
        } catch (Exception e) {
            return null;
        }
    }

    public List<ProductEntity> findDeletedProducts() {
        return em.createQuery("SELECT p FROM ProductEntity p WHERE p.state = :state", ProductEntity.class)
                .setParameter("state", EstadosDoProduto.APAGADO)
                .getResultList();
    }

    public void remove(ProductEntity productEntity) {
        em.remove(em.contains(productEntity) ? productEntity : em.merge(productEntity));
    }

    public List<ProductEntity> findProductsByState(EstadosDoProduto state) {
        try {
            return em.createNamedQuery("Product.findProductsByState", ProductEntity.class)
            .setParameter("state", state)
            .getResultList();
        } catch (NoResultException e) {
            return null;
        }
    }

    public List<ProductEntity> findPurchasedProducts() {
        return em.createNamedQuery("Product.findPurchasedProducts", ProductEntity.class)
                .setParameter("state", EstadosDoProduto.COMPRADO)
                .getResultList();
    }

    public Map<String, Long> countProductsByState() {
        List<Object[]> results = em.createQuery(
            "SELECT p.state, COUNT(p) FROM ProductEntity p GROUP BY p.state", Object[].class
        ).getResultList();

        return results.stream().collect(Collectors.toMap(r -> (String) r[0], r -> (Long) r[1]));
    }

    public double calculateAverageTimeToPurchase() {
        return em.createQuery(
            "SELECT AVG(EXTRACT(DAY FROM (p.purchaseDate - p.publicationDate))) " +
            "FROM ProductEntity p WHERE p.state = 'comprado'",
            Double.class
        ).getSingleResult();
    }

    public List<TimeSeriesDto> getPurchasedProductsOverTime() {
        return em.createQuery(
            "SELECT new aor.paj.dto.TimeSeriesDto(CAST(p.purchaseDate AS date), COUNT(p)) " +
            "FROM ProductEntity p WHERE p.state = 'comprado' " +
            "GROUP BY CAST(p.purchaseDate AS date) " +
            "ORDER BY CAST(p.purchaseDate AS date)",
            TimeSeriesDto.class
        ).getResultList();
    }

}



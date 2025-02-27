package aor.paj.dao;

import aor.paj.entity.ProductEntity;
import jakarta.ejb.Stateless;

@Stateless
public class ProductDao extends AbstratDao<ProductEntity> {
    private static final long serialVersionUID = 1L;
    public ProductDao() {
        super(ProductEntity.class);
    }

}

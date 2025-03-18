package aor.paj.dao;

import aor.paj.entity.CategoryEntity;
import jakarta.ejb.Stateless;


import java.util.Locale;


@Stateless
public class CategoryDao extends AbstratDao<CategoryEntity> {
    private static final long serialVersionUID = 1L;

    public CategoryDao() {
        super(CategoryEntity.class);
    }

    public CategoryEntity createCategory(String name) {
        CategoryEntity category = new CategoryEntity();
        category.setName(name);
        em.persist(category);
        return category;
    }

    // Adiciona o mét0do para buscar uma categoria pelo ID
    public CategoryEntity findById(int categoryId) {
        return em.find(CategoryEntity.class, categoryId);
    }
}

package aor.paj.bean;

import aor.paj.dao.CategoryDao;
import aor.paj.dao.ProductDao;
import aor.paj.dto.CategoryDto;
import aor.paj.entity.CategoryEntity;
import jakarta.ejb.Stateless;
import jakarta.inject.Inject;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Stateless

public class CategoryBean implements Serializable {
    private static final long serialVersionUID = 1L;
    private ProductDao productDao;
    //private static final Logger logger= LogManager.getLogger(CategoryBean.class);
    CategoryBean categoryBean;

    @Inject
    CategoryDao categoryDao;

    @Inject
    public CategoryBean(final CategoryBean categoryBean, final ProductDao productDao) {

        this.categoryBean = categoryBean;
        this.productDao = productDao;
    }

    public CategoryBean() {
    }

    public CategoryEntity convertCategoryDtoToCategoryEntity(CategoryDto categoryDto) {
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setId(categoryDto.getId());
        categoryEntity.setName(categoryDto.getName());
        return categoryEntity;
    }

    public CategoryDto convertCategoryEntityToCategoryDto(CategoryEntity categoryEntity) {
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(categoryEntity.getId());
        categoryDto.setName(categoryEntity.getName());
        return categoryDto;
    }

    public ArrayList<CategoryDto> getAllCategories() {
        List<CategoryEntity> categories = categoryDao.getAllCategories();
        ArrayList <CategoryDto> categoryDtos = new ArrayList<>();
        for (CategoryEntity categoryEntity : categories){
            categoryDtos.add(convertCategoryEntityToCategoryDto(categoryEntity));
        }
        for(CategoryDto categoryDto: categoryDtos){
            System.out.println(categoryDto);
        }
        return categoryDtos;
    }

}



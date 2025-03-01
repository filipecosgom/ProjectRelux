package aor.paj.bean;

import aor.paj.dao.ProductDao;
import aor.paj.dto.CategoryDto;
import aor.paj.entity.CategoryEntity;
import jakarta.inject.Inject;

import java.io.Serializable;

public class CategoryBean implements Serializable {

//private static final Logger logger= LogManager.getLogger(CategoryBean.class);
CategoryBean categoryBean;
ProductDao productDao;

@Inject
    public CategoryBean(final CategoryBean categoryBean, final ProductDao productDao) {

    this.categoryBean=categoryBean;
    this.productDao=productDao;
}
public CategoryBean (){}

 public CategoryEntity convertCategoryDtoToCategoryEntity(CategoryDto categoryDto){
         CategoryEntity categoryEntity = new CategoryEntity();
         categoryEntity.setId(categoryDto.getId());
         categoryEntity.setName(categoryDto.getNome());
         return categoryEntity;
     }

     public CategoryDto convertCategoryEntityToCategoryDto(CategoryEntity categoryEntity){
    CategoryDto categoryDto = new CategoryDto();
    categoryDto.setId(categoryEntity.getId());
    categoryDto.setNome(categoryEntity.getName());
    return categoryDto;
     }
 }


package aor.paj.bean;

import aor.paj.dao.ProductDao;
import aor.paj.dto.CategoryDto;
import aor.paj.entity.CategoryEntity;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;

public class CategoryBeanTest {

    @InjectMocks // Cria uma instância de CategoryBean e injeta os mocks marcados com @Mock
    private CategoryBean categoryBean;

    @BeforeEach // Executado antes de cada teste
    public void setUp() {
        MockitoAnnotations.openMocks(this); // Inicializa os mocks para este teste
    }

    @Test
    public void testConvertCategoryDtoToCategoryEntity() {
        // Preparar (Arrange): Configura os dados de entrada para o teste
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(1);
        categoryDto.setNome("Test Category");

        CategoryEntity categoryEntity = categoryBean.convertCategoryDtoToCategoryEntity(categoryDto);

        // Verificação se o resultado é o esperado
        assertEquals(1L, categoryEntity.getId(), "O ID da categoria deve ser 1");
        assertEquals("Test Category", categoryEntity.getName(), "O nome da categoria deve ser 'Test Category'");
    }

    @Test
    public void testConvertCategoryEntityToCategoryDto() {
        // Preparar (Arrange): Configura os dados de entrada para o teste
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setId(2);
        categoryEntity.setName("Another Category");

        CategoryDto categoryDto = categoryBean.convertCategoryEntityToCategoryDto(categoryEntity);

        // Verificação se o resultado é o esperado
        assertEquals(2, categoryDto.getId(), "O ID da categoria deve ser 2");
        assertEquals("Another Category", categoryDto.getNome(), "O nome da categoria deve ser 'Another Category'");
    }
}
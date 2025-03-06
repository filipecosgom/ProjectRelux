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

    @InjectMocks // InjectMocks: Cria uma instância de CategoryBean e injeta os mocks marcados com @Mock
    private CategoryBean categoryBean;

    @Mock // Mock: Cria um mock para a dependência ProductDao
    private ProductDao productDao;

    @BeforeEach // BeforeEach: Este método é executado antes de cada teste
    public void setUp() {
        MockitoAnnotations.openMocks(this); // Inicializa os mocks para este teste
    }

    @Test // Test: Indica que este método é um caso de teste
    public void testConvertCategoryDtoToCategoryEntity() {
        // Preparar (Arrange): Configura os dados de entrada para o teste
        CategoryDto categoryDto = new CategoryDto();
        categoryDto.setId(1);
        categoryDto.setNome("Test Category");

        // Agir (Act): Executa o método que está sendo testado
        CategoryEntity categoryEntity = categoryBean.convertCategoryDtoToCategoryEntity(categoryDto);

        // Verificar (Assert): Verifica se o resultado é o esperado
        assertEquals(1L, categoryEntity.getId(), "O ID da categoria deve ser 1");
        assertEquals("Test Category", categoryEntity.getName(), "O nome da categoria deve ser 'Test Category'");
    }

    @Test // Test: Indica que este método é um caso de teste
    public void testConvertCategoryEntityToCategoryDto() {
        // Preparar (Arrange): Configura os dados de entrada para o teste
        CategoryEntity categoryEntity = new CategoryEntity();
        categoryEntity.setId(2);
        categoryEntity.setName("Another Category");

        // Agir (Act): Executa o método que está sendo testado
        CategoryDto categoryDto = categoryBean.convertCategoryEntityToCategoryDto(categoryEntity);

        // Verificar (Assert): Verifica se o resultado é o esperado
        assertEquals(2L, categoryDto.getId(), "O ID da categoria deve ser 2");
        assertEquals("Another Category", categoryDto.getNome(), "O nome da categoria deve ser 'Another Category'");
    }
}

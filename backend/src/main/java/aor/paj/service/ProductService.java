package aor.paj.service;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import aor.paj.dto.ProductDto;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.JsonObject;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.json.bind.JsonbConfig;
import jakarta.json.bind.config.PropertyVisibilityStrategy;

@ApplicationScoped
public class ProductService implements Serializable {
    private final String filename = "../database/database.json";
    private Map<String, ProductDto> productMap;

    public ProductService() {
        File file = new File(filename);
        if (file.exists()) {
            try (FileReader fileReader = new FileReader(file)) {
                JsonbConfig config = new JsonbConfig()
                        .withPropertyVisibilityStrategy(new PropertyVisibilityStrategy() {
                            @Override
                            public boolean isVisible(Field field) {
                                return true;
                            }

                            @Override
                            public boolean isVisible(Method method) {
                                return true;
                            }
                        });
                Jsonb jsonb = JsonbBuilder.create(config);
                JsonObject jsonObject = jsonb.fromJson(fileReader, JsonObject.class);
                Type productListType = new ArrayList<ProductDto>() {
                }.getClass().getGenericSuperclass();
                List<ProductDto> products =
                        jsonb.fromJson(jsonObject.getJsonArray("products").toString(),
                        productListType);

                productMap = new HashMap<>();
                for (ProductDto product : products) {
                    productMap.put(product.getId(), product);
                }
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
            productMap = new HashMap<>();
        }
    }

    public ProductDto getProductById(String id) {
        return productMap.get(id);
    }

    public void addProduct(ProductDto product) {
        productMap.put(product.getId(), product);
    }

    public void updateProduct(ProductDto product) {
        productMap.put(product.getId(), product);
    }

    public void deleteProduct(String id) {
        productMap.remove(id);
    }

    public List<ProductDto> getAllProducts() {
        return new ArrayList<>(productMap.values());
    }
}

package aor.paj.service;

import java.io.*;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.List;

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
    private List<ProductDto> products;

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
                products = jsonb.fromJson(jsonObject.getJsonArray("products").toString(), productListType);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        } else {
            products = new ArrayList<ProductDto>();
        }
    }

    public List<ProductDto> getProducts() {
        return products;
    }

    public ProductDto getProductById(String id) {
        for (ProductDto product : products) {
            if (product.getId().equals(id)) {
                return product;
            }
        }
        return null;
    }
}

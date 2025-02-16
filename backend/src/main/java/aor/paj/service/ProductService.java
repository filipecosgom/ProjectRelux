package aor.paj.service;

import java.io.*;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import aor.paj.dto.ProductDto;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.Json;
import jakarta.json.JsonArray;
import jakarta.json.JsonObject;
import jakarta.json.JsonWriter;
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
        saveProductsToFile();
    }

    public void updateProduct(ProductDto product) {
        productMap.put(product.getId(), product);
        saveProductsToFile();
    }

    public void deleteProduct(String id) {
        productMap.remove(id);
        saveProductsToFile();
    }

    public List<ProductDto> getAllProducts() {
        return new ArrayList<>(productMap.values());
    }

    private void saveProductsToFile() {
        File file = new File(filename);
        try (FileWriter fileWriter = new FileWriter(file)) {
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
                    }).withFormatting(true);
            Jsonb jsonb = JsonbBuilder.create(config);
            List<ProductDto> products = new ArrayList<>(productMap.values());

            String productsJson = jsonb.toJson(products);
            JsonArray jsonArray = Json.createReader(new StringReader(productsJson)).readArray();

            JsonObject jsonObject = Json.createObjectBuilder()
                    .add("products", jsonArray)
                    .build();

            try (JsonWriter jsonWriter = Json.createWriter(fileWriter)) {
                jsonWriter.write(jsonObject);
            }
        } catch (IOException e) {
            System.err.println("IOException: " + e.getMessage());
            throw new RuntimeException(e);
        }
    }
}

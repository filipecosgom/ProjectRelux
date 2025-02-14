package aor.paj.bean;

import java.io.*;
import java.util.ArrayList;
import java.util.List;

import aor.paj.dto.ProductDto;
import aor.paj.pojo.UserPojo;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.JsonObject;
import jakarta.json.bind.JsonbBuilder;

@ApplicationScoped
public class ProductBean implements Serializable {
    private final String filename = "../database/database.json";
    private List<ProductDto> products;
    private ArrayList<UserPojo> userPojos;

    public ProductBean() {
        File file = new File(filename);
        if (file.exists()) {
            try (FileReader fileReader = new FileReader(file)) {
                JsonObject jsonObject =
                        JsonbBuilder.create().fromJson(fileReader, JsonObject.class);
                products = JsonbBuilder.create().fromJson(jsonObject.getJsonArray("products").toString(),
                        new ArrayList<ProductDto>() {
                        }.getClass().getGenericSuperclass()
                );
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

    public UserPojo getUser(String username, String password) {
        for (UserPojo u1 : userPojos) {
            if (u1.getUsername().equals(username) && u1.getPassword().equals(password))
                return u1;
        }
        return null;
    }

    public void adicionar_utilizador(UserPojo u1) {
        userPojos.add(u1);
    }
}



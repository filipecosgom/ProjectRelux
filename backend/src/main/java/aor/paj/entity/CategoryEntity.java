package aor.paj.entity;


import java.io.Serializable;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.xml.bind.annotation.XmlTransient;


@Entity
@Table(name="category")
@NamedQuery(name = "Category.findProductsById", query = "SELECT a FROM ProductEntity a WHERE a.id= :id")
@NamedQuery(name = "Category.findProductByUser", query = "SELECT a FROM ProductEntity a WHERE a.userAutor= :owner")
//to get all categories
@NamedQuery(name = "Category.getAllCategories", query = "SELECT a FROM CategoryEntity a")

public class CategoryEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private int id;

    @Column(name = "name", nullable = false, unique = false, updatable = true)
    private String name;

    @OneToMany (fetch=FetchType.LAZY, mappedBy = "category")
    private Set <ProductEntity>  products;



    public int getId() {
        return id;
    }

    public CategoryEntity setId(int id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return name;
    }

    public CategoryEntity setName(String name) {
        this.name = name;
        return this;
    }


    public Set<ProductEntity> getProducts() {
        return products;
    }

    public CategoryEntity setProducts(Set<ProductEntity> products) {
        this.products = products;
        return this;
    }
}

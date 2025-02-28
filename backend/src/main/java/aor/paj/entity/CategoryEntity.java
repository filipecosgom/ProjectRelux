package aor.paj.entity;


import java.io.Serializable;
import java.util.Set;

import jakarta.persistence.*;


@Entity
@Table(name="category")
@NamedQuery(name = "Category.findProductsById", query = "SELECT a FROM ProductEntity a WHERE a.id= :id")
@NamedQuery(name = "Category.findProductByUser", query = "SELECT a FROM ProductEntity a WHERE a.userAutor= :owner")

public class CategoryEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private int id;

    @Column(name = "name", nullable = false, unique = false, updatable = true)
    private String nome;

    @OneToMany (mappedBy = "category")
    private Set <ProductEntity>  products;


}

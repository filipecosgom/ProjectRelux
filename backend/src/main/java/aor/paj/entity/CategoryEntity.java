package aor.paj.entity;


import java.io.Serializable;
import java.util.Set;

import jakarta.persistence.*;


@Entity
@Table(name="category")

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

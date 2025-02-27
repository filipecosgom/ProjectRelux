package aor.paj.entity;


import java.io.Serializable;
import java.util.Set;

import jakarta.persistence.*;


@Entity
@Table(name="user_be")
@NamedQuery(name = "", query = "SELECT u FROM UserEntity u WHERE u.username = :username")
@NamedQuery(name = "", query = "SELECT u FROM UserEntity u WHERE u.email = :email")
@NamedQuery(name = "", query = "SELECT DISTINCT u FROM UserEntity u WHERE u.token = :token")
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

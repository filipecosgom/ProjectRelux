package aor.paj.entity;


import aor.paj.dto.EstadosDoProduto;
import jakarta.persistence.Entity;
import jakarta.persistence.*;

import java.io.Serializable;


@Entity
@Table(name = "product")
@NamedQuery(name = "Product.findProductsById", query = "SELECT a FROM ProductEntity a WHERE a.id= :id")
@NamedQuery(name = "Product.findProductByUser", query = "SELECT a FROM ProductEntity a WHERE a.userAutor= :owner")
public class ProductEntity implements Serializable {
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private int id;

    @Column(name = "title", nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity category;

    @Column(name = "price", nullable = false)
    private double price;

    @Column(name = "imagem", columnDefinition = "TEXT")
    private String imagem;

    @Column(name = "local", nullable = false)
    private String local;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "postDate", nullable = false)
    private String postDate;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity userAutor;

    @Enumerated(EnumType.STRING)
    @Column(name = "state", nullable = false)
    private EstadosDoProduto state;


    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public CategoryEntity getCategory() {
        return category;
    }

    public void setCategory(CategoryEntity category) {
        this.category = category;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getPostDate() {
        return postDate;
    }

    public void setPostDate(String postDate) {
        this.postDate = postDate;
    }

    public UserEntity getUserAutor() {
        return userAutor;
    }

    public void setUserAutor(UserEntity userAutor) {
        this.userAutor = userAutor;
    }

    public EstadosDoProduto getState() {
        return state;
    }

    public void setState(EstadosDoProduto state) {
        this.state = state;
    }
}
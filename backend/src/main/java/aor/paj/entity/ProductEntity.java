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
    private String id;

    @Column(name = "titulo", nullable = false, unique = true)
    private String title;

    @Column(name = "preco", nullable = false, unique = true)
    private double price;

    @Column(name = "imagem", columnDefinition = "TEXT")// no postman estava a dar um erro 500 e era porque os dados de url de uma imagem eram muito grandes. pus este paramentro para me aceitar na base de dados
    private String imagem;

    @Column(name = "local")
    private String local;

    @Column(name = "descricao")
    private String description;

    @Column(name = "dataDePublicacao")
    private String postDate;

    @ManyToOne
    @JoinColumn (name="user_id")
    private UserEntity userAutor;

    @ManyToOne
    private CategoryEntity category;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadosDoProduto state;

    public ProductEntity() {

    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public ProductEntity setTitle(String titulo) {
        this.title = titulo;
        return this;
    }

    public double getPrice() {
        return price;
    }

    public ProductEntity setPrice(double preco) {
        this.price = preco;
        return this;
    }

    public String getImagem() {
        return imagem;
    }

    public ProductEntity setImagem(String imagem) {
        this.imagem = imagem;
        return this;
    }

    public String getLocal() {
        return local;
    }

    public ProductEntity setLocal(String local) {
        this.local = local;
        return this;
    }

    public String getDescription() {
        return description;
    }

    public ProductEntity setDescription(String descricao) {
        this.description = descricao;
        return this;
    }

    public String getPostDate() {
        return postDate;
    }

    public ProductEntity setPostDate(String dataDePublicacao) {
        this.postDate = dataDePublicacao;
        return this;
    }

    public UserEntity getUserAutor() {
        return userAutor;
    }

    public ProductEntity setUserAutor(UserEntity userAutor) {
        this.userAutor = userAutor;
        return this;
    }

    public CategoryEntity getCategory() {
        return category;
    }

    public ProductEntity setCategory(CategoryEntity category) {
        this.category = category;
        return this;
    }

    public EstadosDoProduto getState() {
        return state;
    }

    public ProductEntity setState(EstadosDoProduto estado) {
        this.state = estado;
        return this;
    }
}


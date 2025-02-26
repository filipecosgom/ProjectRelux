package aor.paj.entity;


import aor.paj.dto.CategoryDto;
import aor.paj.dto.EstadosDoProduto;
import jakarta.persistence.Entity;
import jakarta.persistence.*;

import java.io.Serializable;


@Entity
@Table(name = "Product")
@NamedQuery(name = "Products.findProductsById", query = "SELECT a FROM ProductsEntity a WHERE a.id= :id")
@NamedQuery(name = "Products.findProductByUser", query = "SELECT a FROM ProductsEntity a WHERE a.owner= :owner")
public class ProductEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, unique = true, updatable = false)
    private int id;

    @Column(name = "titulo", nullable = false, unique = true)
    private String titulo;

    @Column(name = "categoria", nullable = false, unique = true)
    private CategoryDto categoria;

    @Column(name = "preco", nullable = false, unique = true)
    private double preco;

    @Column(name = "imagem")
    private String imagem;

    @Column(name = "local")
    private String local;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "dataDePublicacao")
    private String dataDePublicacao;

    @ManyToOne
    private UserEntity userAutor;

    @ManyToOne
    private CategoryEntity category;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadosDoProduto estado;

    public ProductEntity(){

    }
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getTitulo() {
        return titulo;
    }

    public ProductEntity setTitulo(String titulo) {
        this.titulo = titulo;
        return this;
    }

    public CategoryDto getCategoria() {
        return categoria;
    }

    public ProductEntity setCategoria(CategoryDto categoria) {
        this.categoria = categoria;
        return this;
    }

    public double getPreco() {
        return preco;
    }

    public ProductEntity setPreco(double preco) {
        this.preco = preco;
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

    public String getDescricao() {
        return descricao;
    }

    public ProductEntity setDescricao(String descricao) {
        this.descricao = descricao;
        return this;
    }

    public String getDataDePublicacao() {
        return dataDePublicacao;
    }

    public ProductEntity setDataDePublicacao(String dataDePublicacao) {
        this.dataDePublicacao = dataDePublicacao;
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

    public EstadosDoProduto getEstado() {
        return estado;
    }

    public ProductEntity setEstado(EstadosDoProduto estado) {
        this.estado = estado;
        return this;
    }
}


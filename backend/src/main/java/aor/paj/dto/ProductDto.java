package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ProductDto {
    private String titulo;
    private String categoria;
    private double preco;
    private String imagem;
    private String local;
    private String descricao;
    private String id;
    private String dataDePublicacao;
    private String userAutor;

    public ProductDto() {
    }

    public ProductDto(String titulo, String categoria, double preco,
            String imagem, String local, String descricao,
            String id, String dataDePublicacao, String userAutor) {
        this.titulo = titulo;
        this.categoria = categoria;
        this.preco = preco;
        this.imagem = imagem;
        this.local = local;
        this.descricao = descricao;
        this.id = id;
        this.dataDePublicacao = dataDePublicacao;
        this.userAutor = userAutor;
    }

    @XmlElement
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    @XmlElement
    public String getCategoria() {
        return categoria;
    }

    public void setCategoria(String categoria) {
        this.categoria = categoria;
    }

    @XmlElement
    public double getPreco() {
        return preco;
    }

    public void setPreco(double preco) {
        this.preco = preco;
    }

    @XmlElement
    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    @XmlElement
    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    @XmlElement
    public String getLocal() {
        return local;
    }

    public void setLocal(String local) {
        this.local = local;
    }

    @XmlElement
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @XmlElement
    public String getDataDePublicacao() {
        return dataDePublicacao;
    }

    public void setDataDePublicacao(String dataDePublicacao) {
        this.dataDePublicacao = dataDePublicacao;
    }

    @XmlElement
    public String getUserAutor() {
        return userAutor;
    }

    public void setUserAutor(String userAutor) {
        this.userAutor = userAutor;
    }
}

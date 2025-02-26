package aor.paj.dto;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ProductDto {
    public static int incremento = 0;
    private String titulo;
    private Category categoria;
    private double preco;
    private String imagem;
    private String local;
    private String descricao;
    private String id;
    private String dataDePublicacao;
    private String userAutor;
    private EstadosDoProduto estado;

    public ProductDto() {
        this.id = generateTimestampId();
        this.estado = EstadosDoProduto.DISPONIVEL;
    }

    public ProductDto(String titulo, Category categoria, double preco,
            String imagem, String local, String descricao, String dataDePublicacao, String userAutor, int stateId) {
        this.titulo = titulo;
        this.categoria=categoria;
        this.preco = preco;
        this.imagem = imagem;
        this.local = local;
        this.descricao = descricao;
        this.dataDePublicacao = dataDePublicacao;
        this.userAutor = userAutor;
        this.id = generateTimestampId();
        this.estado = EstadosDoProduto.fromStateId(stateId);
    }

    private String generateTimestampId() {
        String timeStamp = new SimpleDateFormat("yyMMddHHmm").format(new Date());
        String result = String.format("%s%03d", timeStamp, ++incremento);
        return result;
    }

    @XmlElement
    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    @XmlElement
    public Category getCategoria() {
        return categoria;
    }

    public void setCategoria(Category categoria) {
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


    @XmlElement
    public EstadosDoProduto getEstado() {
        return estado;
    }

    public void setEstado(EstadosDoProduto estado) {
        this.estado = estado;
    }

    public void setEstadoById(int stateId) {
        this.estado = EstadosDoProduto.fromStateId(stateId);
    }
}

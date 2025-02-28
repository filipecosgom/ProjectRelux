package aor.paj.dto;

import java.text.SimpleDateFormat;
import java.util.Date;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class ProductDto {
    public static int incremento = 0;
    private String title;
    private CategoryDto category;
    private double price;
    private String imagem;
    private String local;
    private String description;
    private String id;
    private String postDate;
    private String userAutor;
    private EstadosDoProduto state;

    public ProductDto() {
        this.id = generateTimestampId();
        this.state = EstadosDoProduto.DISPONIVEL;
    }

    public ProductDto(String title, CategoryDto category, double price,
                      String imagem, String local, String description, String postDate, String userAutor, int stateId) {
        this.title = title;
        this.category=category;
        this.price = price;
        this.imagem = imagem;
        this.local = local;
        this.description = description;
        this.postDate = postDate;
        this.userAutor = userAutor;
        this.id = generateTimestampId();
        this.state = EstadosDoProduto.fromStateId(stateId);
    }

    private String generateTimestampId() {
        String timeStamp = new SimpleDateFormat("yyMMddHHmm").format(new Date());
        String result = String.format("%s%03d", timeStamp, ++incremento);
        return result;
    }

    @XmlElement
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    @XmlElement
    public CategoryDto getCategory() {
        return category;
    }

    public void setCategory(CategoryDto category) {
        this.category = category;
    }

    @XmlElement
    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    @XmlElement
    public String getImagem() {
        return imagem;
    }

    public void setImagem(String imagem) {
        this.imagem = imagem;
    }

    @XmlElement
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
    public String getPostDate() {
        return postDate;
    }

    public void setPostDate(String postDate) {
        this.postDate = postDate;
    }

    @XmlElement
    public String getUserAutor() {
        return userAutor;
    }

    public void setUserAutor(String userAutor) {
        this.userAutor = userAutor;
    }


    @XmlElement
    public EstadosDoProduto getState() {
        return state;
    }

    public void setState(EstadosDoProduto state) {
        this.state = state;
    }

    public void setEstadoById(int stateId) {
        this.state = EstadosDoProduto.fromStateId(stateId);
    }
}

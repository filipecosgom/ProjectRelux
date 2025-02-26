package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class CategoryDto {
    private int id;
    private String nome;

    public CategoryDto() {

    }

    public CategoryDto(int id, String nome) {
        this.id = id;
        this.nome = nome;

    }

    @XmlElement
    public int getId() {
        return id;
    }

    public CategoryDto setId(int id) {
        this.id = id;
        return this;
    }

    @XmlElement
    public String getNome() {
        return nome;
    }

    public CategoryDto setNome(String nome) {
        this.nome = nome;
        return this;
    }
}

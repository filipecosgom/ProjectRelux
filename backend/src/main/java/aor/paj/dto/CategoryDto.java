package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class CategoryDto {
    private int id;
    private String name; // Renomeado de "nome" para "name"

    public CategoryDto() {

    }

    public CategoryDto(int id, String name) {
        this.id = id;
        this.name = name;
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
    public String getName() { // Renomeado de "getNome" para "getName"
        return name;
    }

    public CategoryDto setName(String name) { // Renomeado de "setNome" para "setName"
        this.name = name;
        return this;
    }
}

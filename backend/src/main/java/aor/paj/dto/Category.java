package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Category {
private int id;
private String nome;

public Category() {

}
public Category(int id, String nome) {
   this.id = id;
   this.nome = nome;

}

    @XmlElement
    public int getId() {
        return id;
    }

    public Category setId(int id) {
        this.id = id;
        return this;
    }

    @XmlElement
    public String getNome() {
        return nome;
    }

    public Category setNome(String nome) {
        this.nome = nome;
        return this;
    }
}

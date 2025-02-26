package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Categoria {
private int id;
private String nome;

public Categoria() {

}
public Categoria(int id, String nome) {
   this.id = id;
   this.nome = nome;

}

    @XmlElement
    public int getId() {
        return id;
    }

    public Categoria setId(int id) {
        this.id = id;
        return this;
    }

    @XmlElement
    public String getNome() {
        return nome;
    }

    public Categoria setNome(String nome) {
        this.nome = nome;
        return this;
    }
}

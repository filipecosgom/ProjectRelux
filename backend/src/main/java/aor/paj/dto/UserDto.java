package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class UserDto {
    private String username;
    private String password;

    public UserDto() {
    }

    public UserDto(String username, String password) {
        this.username = username;
        this.password = password;
    }


    @XmlElement
    public String getUsername() {
        return username;
    }

    @XmlElement
    public String getPassword() {
        return password;
    }
}


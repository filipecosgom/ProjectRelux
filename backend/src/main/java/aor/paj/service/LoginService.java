package aor.paj.service;

import aor.paj.pojo.UserPojo;
import jakarta.enterprise.context.SessionScoped;

import java.io.Serializable;

@SessionScoped
public class LoginService implements Serializable {

    UserPojo utilizadorAtualPojo;

    public LoginService() {

    }
    public LoginService(UserPojo utilizadorAtualPojo) {
        this.utilizadorAtualPojo = utilizadorAtualPojo;
    }

    public UserPojo getUtilizadorAtualPojo() {
        return utilizadorAtualPojo;
    }

    public void setUtilizadorAtualPojo(UserPojo utilizadorAtualPojo) {
        this.utilizadorAtualPojo=utilizadorAtualPojo;
    }
}

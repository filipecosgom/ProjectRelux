package aor.paj.bean;

import aor.paj.pojo.UserPojo;
import jakarta.enterprise.context.SessionScoped;

import java.io.Serializable;

@SessionScoped
public class LoginBean implements Serializable {

    UserPojo utilizadorAtualPojo;

    public LoginBean() {

    }
    public LoginBean(UserPojo utilizadorAtualPojo) {
        this.utilizadorAtualPojo = utilizadorAtualPojo;
    }

    public UserPojo getUtilizadorAtualPojo() {
        return utilizadorAtualPojo;
    }

    public void setUtilizadorAtualPojo(UserPojo utilizadorAtualPojo) {
        this.utilizadorAtualPojo=utilizadorAtualPojo;
    }
}

package aor.paj.dao;

import aor.paj.entity.UserEntity;
import aor.paj.dto.TimeSeriesDto;
import aor.paj.dto.UserProductStatsDto;
import jakarta.ejb.Stateless;
import jakarta.persistence.NoResultException;

import java.util.List;

@Stateless
public class UserDao extends AbstratDao<UserEntity> {
    private static final long serialVersionUID = 1L;


    public UserDao() {
        super(UserEntity.class);
    }


    public UserEntity findByToken(String token) {
        try {
            return (UserEntity) em.createNamedQuery("Utilizador.findUserByToken").setParameter("token", token)
                    .getSingleResult();

        } catch (NoResultException e) {
            return null;
        }
    }


    public UserEntity findUserByUsername(String username) {
        try {
            return (UserEntity) em.createNamedQuery("Utilizador.findUserByUsername").setParameter("username", username)
                    .getSingleResult();

        } catch (NoResultException e) {
            return null;
        }
    }

    public List<UserEntity> findDeletedUsers() {
        try {
            return em.createNamedQuery("Utilizador.getDeletedUsers", UserEntity.class).getResultList();
        } catch (NoResultException e) {
            return null;
        }
    }

    public List<UserEntity> findAll() {
        try {
            return em.createNamedQuery("Utilizador.getAllUsers", UserEntity.class).getResultList();
        } catch (NoResultException e) {
            return null;
        }
    }

    public UserEntity findByVerificationToken(String token) {
        try {
            return em.createQuery("SELECT u FROM UserEntity u WHERE u.verificationToken = :token", UserEntity.class)
                    .setParameter("token", token)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null; // Retorna null se nenhum resultado for encontrado
        }
    }
 
    public UserEntity findByPasswordRecoveryToken(String token) {
        try {
            return em.createQuery("SELECT u FROM UserEntity u WHERE u.passwordRecoveryToken = :token", UserEntity.class)
                    .setParameter("token", token)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null; // Retorna null se nenhum resultado for encontrado
        }
    }

    public UserEntity findUserByEmail(String email) {
        try {
            return em.createQuery("SELECT u FROM UserEntity u WHERE u.email = :email", UserEntity.class)
                    .setParameter("email", email)
                    .getSingleResult();
        } catch (NoResultException e) {
            return null; // Retorna null se nenhum resultado for encontrado
        }
    }

    public List<UserEntity> findUnverifiedUsers() {
        return em.createQuery("SELECT u FROM UserEntity u WHERE u.isVerified = false", UserEntity.class)
                .getResultList();
    }

    public String getUserImageByUsername(String username) {
    try {
        return em.createQuery(
                "SELECT u.imagem FROM UserEntity u WHERE u.username = :username", String.class)
                .setParameter("username", username)
                .getSingleResult();
    } catch (NoResultException e) {
        System.out.println("Usuário não encontrado: " + username);
        return null; // Retorna null se o usuário não for encontrado
    }
}

    public long countAllUsers() {
        return em.createQuery("SELECT COUNT(u) FROM UserEntity u", Long.class).getSingleResult();
    }

    public long countVerifiedUsers() {
        return em.createQuery("SELECT COUNT(u) FROM UserEntity u WHERE u.isVerified = true", Long.class).getSingleResult();
    }

    public List<TimeSeriesDto> getRegisteredUsersOverTime() {
        return em.createQuery(
            "SELECT new aor.paj.dto.TimeSeriesDto(CAST(u.registrationDate AS date), COUNT(u)) " +
            "FROM UserEntity u GROUP BY CAST(u.registrationDate AS date) " +
            "ORDER BY CAST(u.registrationDate AS date)",
            TimeSeriesDto.class
        ).getResultList();
    }

    public List<UserProductStatsDto> getProductsByUser() {
        return em.createQuery(
            "SELECT new aor.paj.dto.UserProductStatsDto(u.username, COUNT(p), " +
            "SUM(CASE WHEN p.state = 'rascunho' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN p.state = 'publicado' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN p.state = 'reservado' THEN 1 ELSE 0 END), " +
            "SUM(CASE WHEN p.state = 'comprado' THEN 1 ELSE 0 END)) " +
            "FROM UserEntity u LEFT JOIN u.products p GROUP BY u.username",
            UserProductStatsDto.class
        ).getResultList();
    }
}

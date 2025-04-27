package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class UserProductStatsDto {
    private String username;
    private long totalProducts;
    private long draftProducts;
    private long publishedProducts;
    private long reservedProducts;
    private long purchasedProducts;

    public UserProductStatsDto() {
    }

    public UserProductStatsDto(String username, long totalProducts, long draftProducts, long publishedProducts, long reservedProducts, long purchasedProducts) {
        this.username = username;
        this.totalProducts = totalProducts;
        this.draftProducts = draftProducts;
        this.publishedProducts = publishedProducts;
        this.reservedProducts = reservedProducts;
        this.purchasedProducts = purchasedProducts;
    }

    @XmlElement
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    @XmlElement
    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    @XmlElement
    public long getDraftProducts() {
        return draftProducts;
    }

    public void setDraftProducts(long draftProducts) {
        this.draftProducts = draftProducts;
    }

    @XmlElement
    public long getPublishedProducts() {
        return publishedProducts;
    }

    public void setPublishedProducts(long publishedProducts) {
        this.publishedProducts = publishedProducts;
    }

    @XmlElement
    public long getReservedProducts() {
        return reservedProducts;
    }

    public void setReservedProducts(long reservedProducts) {
        this.reservedProducts = reservedProducts;
    }

    @XmlElement
    public long getPurchasedProducts() {
        return purchasedProducts;
    }

    public void setPurchasedProducts(long purchasedProducts) {
        this.purchasedProducts = purchasedProducts;
    }
}
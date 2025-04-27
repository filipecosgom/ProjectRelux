package aor.paj.dto;

import jakarta.xml.bind.annotation.XmlElement;
import jakarta.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class TimeSeriesDto {
    private String date;
    private long count;

    public TimeSeriesDto() {
    }

    public TimeSeriesDto(String date, long count) {
        this.date = date;
        this.count = count;
    }

    @XmlElement
    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    @XmlElement
    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}
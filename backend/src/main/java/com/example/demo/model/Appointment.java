package com.example.demo.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String animalName;
    private String doctorName;
    private String date;
    @ElementCollection
    private List<Service> services;
    private String diagnostic;
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAnimalName() { return animalName; }
    public void setAnimalName(String animalName) { this.animalName = animalName; }

    public String getDoctorName() { return doctorName; }
    public void setDoctorName(String doctorName) { this.doctorName = doctorName; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }

    public List<Service> getServices() { return services; }
    public void setServices(List<Service> services) { this.services = services; }

    public String getDiagnostic() { return diagnostic; }
    public void setDiagnostic(String diagnostic) { this.diagnostic = diagnostic; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}

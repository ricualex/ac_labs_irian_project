package com.example.demo.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Service {
    private String name;
    private double price;

    public Service() {}

    public Service(String name, double price) {
        this.name = name;
        this.price = price;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }
}

package com.java.model;

import lombok.Data;

import java.util.List;

@Data
public class Purchase {
    private Integer idPurchase;
    private Integer idClient;
    private String clientName;
    private List<Product> products;
    private int quantity;
}

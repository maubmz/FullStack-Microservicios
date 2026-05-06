package com.java.model;

import lombok.Data;

import java.util.List;

@Data
public class Purchase {
    private Integer id;
    private Client client;
    private List<Product> products;
    private int quantity;
}

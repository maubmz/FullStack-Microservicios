package com.java.model;

import lombok.Data;

import java.util.List;

@Data
public class Client {
    private Integer idClient;
    private String name;
    private String email;
    private String phone;
    private List<Purchase> purchases;
}

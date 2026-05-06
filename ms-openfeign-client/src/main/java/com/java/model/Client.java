package com.java.model;

import lombok.Data;

import java.util.List;

@Data
public class Client {
    private Integer id;
    private String name;
    private String email;
    private String phoneNumber;
    private List<Purchase> purchases;
}

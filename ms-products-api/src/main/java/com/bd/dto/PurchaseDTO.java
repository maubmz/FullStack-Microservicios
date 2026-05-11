package com.bd.dto;

import com.bd.model.Product;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PurchaseDTO {
    private Integer idPurchase;
    private Integer idClient;
    private String clientName;
    private List<Product> products;
    private int quantity;
}

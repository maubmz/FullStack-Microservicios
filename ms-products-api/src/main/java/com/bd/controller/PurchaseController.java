package com.bd.controller;

import com.bd.dto.PurchaseDTO;
import com.bd.service.PurchaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequestMapping("/api")
@RestController
public class PurchaseController {

    private final PurchaseService purchaseService;

    public PurchaseController(PurchaseService purchaseService) {
        this.purchaseService = purchaseService;
    }

    @GetMapping("/compras")
    public List<PurchaseDTO> getAllPurchases() {
        return purchaseService.findAll();
    }

    @GetMapping("/compras/{id}")
    public PurchaseDTO findPurchaseById(@PathVariable("id") Integer id) {
        return purchaseService.findPurchaseById(id);
    }

    @PostMapping("/compras")
    public PurchaseDTO createPurchase(@RequestBody PurchaseDTO purchase) {
        return purchaseService.savePurchase(purchase);
    }

    @PutMapping("/compras/{id}")
    public PurchaseDTO updatePurchase(@PathVariable("id") Integer id, @RequestBody PurchaseDTO purchase) {
        return purchaseService.updatePurchaseById(id, purchase);
    }

    @DeleteMapping("/compras/{id}")
    public PurchaseDTO deletePurchase(@PathVariable("id") Integer id) {
        return purchaseService.deletePurchaseById(id);
    }

}

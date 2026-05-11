package com.bd.service;

import com.bd.dto.PurchaseDTO;
import com.bd.model.Client;
import com.bd.model.Product;
import com.bd.model.Purchase;
import com.bd.repository.ClientRepository;
import com.bd.repository.PurchaseRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class PurchaseService {
    private final PurchaseRepository purchaseRepository;
    private final ClientRepository clientRepository;
    private final ProductService productService;
    private static final String ERROR_PURCHASE = "No existe la compra con el id: ";

    public PurchaseService(PurchaseRepository purchaseRepository,
                           ClientRepository clientRepository,
                           ProductService productService) {
        this.purchaseRepository = purchaseRepository;
        this.clientRepository = clientRepository;
        this.productService = productService;
    }

    @Transactional
    public PurchaseDTO savePurchase(PurchaseDTO purchaseDTO) {
        Purchase purchase = new Purchase();
        Client client = clientRepository.findById(purchaseDTO.getIdClient())
                .orElseThrow(() -> new RuntimeException("No existe el cliente con el ID: " + purchaseDTO.getIdClient()));
        List<Product> productList = new ArrayList<>();

        for (Product product: purchaseDTO.getProducts()) {
            Product pFind = productService.findProductById(product.getId());
            productService.decreaseStock(pFind);
            productList.add(pFind);
        }

        purchase.setClient(client);
        purchase.setProducts(productList);
        purchase.setQuantity(productList.size());
        Purchase saved = purchaseRepository.save(purchase);
        return convertPurchaseToDto(saved);
    }

    public PurchaseDTO findPurchaseById(Integer id) {
        Purchase purchase = purchaseRepository.findByIdPurchase(id)
                .orElseThrow(() -> new RuntimeException(ERROR_PURCHASE + id));
        return convertPurchaseToDto(purchase);
    }

    public List<PurchaseDTO> findAll() {
        List<Purchase> purchases = purchaseRepository.findAllPurchases();
        List<PurchaseDTO> purchaseDTOS = new ArrayList<>();
        for (Purchase purchase: purchases) {
            PurchaseDTO pdto = convertPurchaseToDto(purchase);
            purchaseDTOS.add(pdto);
        }
        return purchaseDTOS;
    }

    @Transactional
    public PurchaseDTO updatePurchaseById(Integer id, PurchaseDTO purchaseDTO) {
        Purchase purchase = purchaseRepository.findByIdPurchase(id)
                .orElseThrow(() -> new RuntimeException(ERROR_PURCHASE + id));
        Client client = clientRepository.findById(purchaseDTO.getIdClient())
                .orElseThrow(() -> new RuntimeException("No existe el cliente con el Id: " + purchaseDTO.getIdClient()));
        List<Product> productList = new ArrayList<>();

        for (Product oldProduct: purchase.getProducts()) {
            productService.increaseStock(oldProduct);
        }

        for (Product product: purchaseDTO.getProducts()) {
            Product pFind = productService.findProductById(product.getId());
            productService.decreaseStock(pFind);
            productList.add(pFind);
        }

        purchase.getProducts().clear();
        purchase.setClient(client);
        purchase.setProducts(productList);
        purchase.setQuantity(productList.size());
        return convertPurchaseToDto(purchaseRepository.save(purchase));
    }

    @Transactional
    public PurchaseDTO deletePurchaseById(Integer id) {
        Purchase purchase = purchaseRepository.findByIdPurchase(id)
                .orElseThrow(() -> new RuntimeException("No existe el purchase con el ID: " + id));
        for (Product product: purchase.getProducts()) {
            productService.increaseStock(product);
        }
        purchaseRepository.delete(purchase);
        return convertPurchaseToDto(purchase);
    }

    public PurchaseDTO convertPurchaseToDto(Purchase purchase) {
        PurchaseDTO purchaseDto = new PurchaseDTO();
        purchaseDto.setIdPurchase(purchase.getId());
        purchaseDto.setIdClient(purchase.getClient().getId());
        purchaseDto.setClientName(purchase.getClient().getName());
        purchaseDto.setProducts(purchase.getProducts());
        purchaseDto.setQuantity(purchase.getQuantity());
        return purchaseDto;
    }

}

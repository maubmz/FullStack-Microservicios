package com.java.service;

import com.java.client.feign.ProductFeignClient;
import com.java.model.Product;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductFeignClient productFeignClient;

    public ProductService(ProductFeignClient productFeignClient) {
        this.productFeignClient = productFeignClient;
    }

    public List<Product> getAllProducts() {
        return productFeignClient.getAllProducts();
    }

    public Product getProductById(Integer id) {
        return productFeignClient.getProductById(id);
    }

    public Product saveProduct(Product product) {
        return productFeignClient.createProduct(product);
    }

    public Product updateProductById(Product product, Integer id) {
        return productFeignClient.updateProductById(id, product);
    }

    public Product deletePRoductById(Integer id) {
        return productFeignClient.deleteProductById(id);
    }

    public List<Product> getProductsByMinusStock() {
        return productFeignClient.findProductsByMinusStock();
    }

}

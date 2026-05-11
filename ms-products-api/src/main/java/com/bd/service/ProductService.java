package com.bd.service;

import com.bd.model.Product;
import com.bd.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {
    private final ProductRepository productRepository;
    private static final String ERROR_MESSAGE = "No existe el producto con id: ";

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public List<Product> findAll() {
        return productRepository.findAll();
    }

    public Product findProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(ERROR_MESSAGE + id));
    }

    public Product updateProductById(Integer id, Product product) {
        Product oldProduct = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(ERROR_MESSAGE + id));
        oldProduct.setName(product.getName());
        oldProduct.setPrice(product.getPrice());
        oldProduct.setStock(product.getStock());
        return productRepository.save(oldProduct);
    }

    public Product deleteProductById(Integer id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException(ERROR_MESSAGE + id));
        productRepository.deleteById(id);
        return product;
    }

    public void decreaseStock(Product product) {
        if (product.getStock() <= 0) {
            throw new RuntimeException(
                    "No hay stock disponible para el producto: " + product.getName()
            );
        }

        product.setStock(product.getStock() - 1);
        productRepository.save(product);
    }

    public void increaseStock(Product product) {
        product.setStock(product.getStock() + 1);
        productRepository.save(product);
    }

}

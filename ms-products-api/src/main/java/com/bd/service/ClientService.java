package com.bd.service;

import com.bd.dto.ClientDTO;
import com.bd.dto.PurchaseDTO;
import com.bd.model.Client;
import com.bd.model.Purchase;
import com.bd.repository.ClientRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ClientService {
    private final ClientRepository clientRepository;

    public ClientService(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Transactional
    public ClientDTO saveClient(ClientDTO clientDto) {
        Client client = new Client();
        client.setName(clientDto.getName());
        client.setEmail(clientDto.getEmail());
        client.setPhoneNumber(clientDto.getPhone());

        Client saved = clientRepository.save(client);
        return convertClientToDto(saved);
    }

    public List<ClientDTO> findAllClient() {
        List<Client> clients = clientRepository.findAllWithPurchases();
        List<ClientDTO> clientDTOs = new ArrayList<>();
        for (Client client : clients) {
            clientDTOs.add(convertClientToDto(client));
        }
        return clientDTOs;
    }

    public ClientDTO findClientById(Integer id) {
        Client client = clientRepository.findByIdWithPurchases(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
        return convertClientToDto(client);
    }

    public ClientDTO updateClientById(Integer id, ClientDTO clientDto) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
        client.setName(clientDto.getName());
        client.setEmail(clientDto.getEmail());
        client.setPhoneNumber(clientDto.getPhone());

        return convertClientToDto(clientRepository.save(client));
    }

    public ClientDTO deleteClientById(Integer id) {
        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado con id: " + id));
        ClientDTO clientDTO = convertClientToDto(client);
        clientRepository.deleteById(id);
        return clientDTO;
    }

    public ClientDTO convertClientToDto(Client client) {
        ClientDTO clientDTO = new ClientDTO();
        clientDTO.setIdClient(client.getId());
        clientDTO.setName(client.getName());
        clientDTO.setEmail(client.getEmail());
        clientDTO.setPhone(client.getPhoneNumber());

        if (client.getPurchases() != null) {
            List<PurchaseDTO> purchaseDTOS = client.getPurchases().stream()
                    .map(this::convertPurchaseToDto)
                    .toList();
            clientDTO.setPurchases(purchaseDTOS);
        } else {
            clientDTO.setPurchases(new ArrayList<>());
        }
        return clientDTO;
    }

    public PurchaseDTO convertPurchaseToDto(Purchase purchase) {
        PurchaseDTO purchaseDTO = new PurchaseDTO();
        purchaseDTO.setIdPurchase(purchase.getId());
        purchaseDTO.setQuantity(purchase.getQuantity());
        purchaseDTO.setProducts(purchase.getProducts());

        if (purchase.getClient() != null) {
            purchaseDTO.setIdClient(purchase.getClient().getId());
            purchaseDTO.setClientName(purchase.getClient().getName());
        }
        return purchaseDTO;
    }

}

package com.bd.controller;

import com.bd.dto.ClientDTO;
import com.bd.model.Client;
import com.bd.service.ClientService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class ClientController {

    private final ClientService clientService;

    public ClientController(ClientService clientService) {
        this.clientService = clientService;
    }

    @PostMapping("/clientes")
    public ResponseEntity<ClientDTO> createClient(@RequestBody ClientDTO client) {
        ClientDTO savedClient = clientService.saveClient(client);
        return new ResponseEntity<>(savedClient, HttpStatus.CREATED);
    }

    @GetMapping("/clientes")
    public ResponseEntity<List<ClientDTO>> findAllClients() {
        return ResponseEntity.ok(clientService.findAllClient());
    }

    @GetMapping("/clientes/{id}")
    public ResponseEntity<ClientDTO> findClientById(@PathVariable Integer id) {
        return ResponseEntity.ok(clientService.findClientById(id));
    }

    @PutMapping("/clientes/{id}")
    public ResponseEntity<ClientDTO> updateClientById(@PathVariable("id") Integer id, @RequestBody ClientDTO client) {
        ClientDTO response = clientService.updateClientById(id, client);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping("/clientes/{id}")
    public ResponseEntity<ClientDTO> deleteClientById(@PathVariable Integer id) {
        ClientDTO response = clientService.deleteClientById(id);
        return ResponseEntity.ok(response);
    }

}

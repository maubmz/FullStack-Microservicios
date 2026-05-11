package com.bd.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ClientDTO {
    private Integer idClient;
    private String name;
    private String email;
    private String phone;
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<PurchaseDTO> purchases;

}

package com.clickandcollect.backend.dto;



import lombok.AllArgsConstructor;

import lombok.Data;

import lombok.NoArgsConstructor;



@Data

@NoArgsConstructor

@AllArgsConstructor



public class UserResponseDTO {

    private Long id;

    private String email;

    private String firstname;

    private String lastname;

    private String role;

    private String token;


}
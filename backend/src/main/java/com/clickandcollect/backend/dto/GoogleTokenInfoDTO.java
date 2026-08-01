package com.clickandcollect.backend.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

// Réponse de https://oauth2.googleapis.com/tokeninfo, utilisée pour vérifier
// un ID token Google côté serveur sans dépendance supplémentaire.
@Data
@JsonIgnoreProperties(ignoreUnknown = true)
public class GoogleTokenInfoDTO {

    private String aud;
    private String sub;
    private String email;

    @JsonProperty("email_verified")
    private String emailVerified;

    @JsonProperty("given_name")
    private String givenName;

    @JsonProperty("family_name")
    private String familyName;
}

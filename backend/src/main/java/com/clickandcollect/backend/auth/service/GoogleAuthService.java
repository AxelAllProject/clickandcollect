package com.clickandcollect.backend.auth.service;

import com.clickandcollect.backend.auth.dto.GoogleTokenInfoDTO;
import com.clickandcollect.backend.auth.exception.InvalidCredentialsException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

@Service
public class GoogleAuthService {

    private final RestClient restClient = RestClient.create();

    @Value("${google.client-id}")
    private String googleClientId;


    public String getClientId() {
        return googleClientId;
    }

    public GoogleTokenInfoDTO verify(String idToken) {
        GoogleTokenInfoDTO tokenInfo;
        try {
            tokenInfo = restClient.get()
                    .uri("https://oauth2.googleapis.com/tokeninfo?id_token={idToken}", idToken)
                    .retrieve()
                    .body(GoogleTokenInfoDTO.class);
        } catch (RestClientException e) {
            throw new InvalidCredentialsException("Jeton Google invalide");
        }

        if (tokenInfo == null || tokenInfo.getAud() == null || !tokenInfo.getAud().equals(googleClientId)) {
            throw new InvalidCredentialsException("Jeton Google invalide");
        }
        if (!"true".equals(tokenInfo.getEmailVerified())) {
            throw new InvalidCredentialsException("Adresse email Google non vérifiée");
        }

        return tokenInfo;
    }
}

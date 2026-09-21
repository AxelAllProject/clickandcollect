package com.clickandcollect.backend.common;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.nio.charset.StandardCharsets;

/**
 * Ecrit une erreur au meme format que ErrorResponse depuis la chaine de filtres,
 * ou le @RestControllerAdvice n'est pas encore atteint.
 */
public final class HttpErrorWriter {

    private HttpErrorWriter() {
    }

    public static void write(HttpServletResponse response, int status, String message) throws IOException {
        if (response.isCommitted()) {
            return;
        }
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.getWriter().write(
                "{\"status\":%d,\"message\":\"%s\",\"timestamp\":%d}"
                        .formatted(status, echapper(message), System.currentTimeMillis()));
    }

    private static String echapper(String valeur) {
        return valeur == null ? "" : valeur.replace("\\", "\\\\").replace("\"", "\\\"");
    }
}

package com.clickandcollect.backend.common;

import com.clickandcollect.backend.auth.exception.EmailAlreadyUsedException;
import com.clickandcollect.backend.auth.exception.InvalidCredentialsException;
import com.clickandcollect.backend.auth.exception.InvalidTokenException;
import com.clickandcollect.backend.common.exception.ForbiddenOperationException;
import com.clickandcollect.backend.common.exception.InsufficientStockException;
import com.clickandcollect.backend.common.exception.ResourceNotFoundException;
import com.clickandcollect.backend.order.SlotFullException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

/**
 * Traduction centralisee des exceptions en reponses HTTP.
 *
 * On herite de ResponseEntityExceptionHandler pour que les exceptions standard de
 * Spring MVC (validation, 404, methode non supportee...) gardent leur traitement natif :
 * seul ce qui n'est pas deja couvert tombe dans le handler generique 500.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private static ResponseEntity<ErrorResponse> reponse(HttpStatus status, String message) {
        return new ResponseEntity<>(
                new ErrorResponse(status.value(), message, System.currentTimeMillis()),
                status);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceException(ResourceNotFoundException ex) {
        return reponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(InsufficientStockException.class)
    public ResponseEntity<ErrorResponse> handleInsufficientException(InsufficientStockException ex) {
        return reponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(ForbiddenOperationException.class)
    public ResponseEntity<ErrorResponse> handleForbiddenException(ForbiddenOperationException ex) {
        return reponse(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(SlotFullException.class)
    public ResponseEntity<ErrorResponse> handleSlotFullException(SlotFullException ex) {
        return reponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(EmailAlreadyUsedException.class)
    public ResponseEntity<ErrorResponse> handleEmailAlreadyUsedException(EmailAlreadyUsedException ex) {
        return reponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentialsException(InvalidCredentialsException ex) {
        return reponse(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(InvalidTokenException.class)
    public ResponseEntity<ErrorResponse> handleInvalidTokenException(InvalidTokenException ex) {
        return reponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    /**
     * Refus de @PreAuthorize : sans ce handler l'AccessDeniedException, qui est une
     * RuntimeException, etait traduite en 400 au lieu de 403.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex) {
        return reponse(HttpStatus.FORBIDDEN, "Accès refusé");
    }

    /** Regles metier explicitement signalees par le code (panier vide, commande non annulable...). */
    @ExceptionHandler({IllegalStateException.class, IllegalArgumentException.class})
    public ResponseEntity<ErrorResponse> handleBusinessRuleException(RuntimeException ex) {
        return reponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    /**
     * Filet de securite. Tout ce qui arrive ici est un bug : on le journalise avec sa stack
     * et on renvoie un message generique, sans exposer le detail interne au client.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpectedException(Exception ex) {
        log.error("Erreur inattendue non geree", ex);
        return reponse(HttpStatus.INTERNAL_SERVER_ERROR,
                "Une erreur interne est survenue. Merci de réessayer plus tard.");
    }
}

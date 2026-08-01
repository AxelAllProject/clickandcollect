package com.clickandcollect.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from}")
    private String from;

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String resetLink = frontendUrl + "/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(toEmail);
        message.setSubject("Click & Collect - Réinitialisation de votre mot de passe");
        message.setText(
                "Bonjour,\n\n" +
                "Tu as demandé la réinitialisation de ton mot de passe Click & Collect.\n" +
                "Clique sur le lien ci-dessous pour en choisir un nouveau (valable 30 minutes) :\n\n" +
                resetLink + "\n\n" +
                "Si tu n'es pas à l'origine de cette demande, ignore simplement cet email."
        );

        mailSender.send(message);
    }

    public void sendTwoFactorCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(toEmail);
        message.setSubject("Click & Collect - Code de connexion");
        message.setText(
                "Bonjour,\n\n" +
                "Voici ton code de vérification pour te connecter à Click & Collect :\n\n" +
                code + "\n\n" +
                "Ce code est valable 10 minutes. Si tu n'es pas à l'origine de cette connexion, " +
                "ignore cet email et modifie ton mot de passe par sécurité."
        );

        mailSender.send(message);
    }
}

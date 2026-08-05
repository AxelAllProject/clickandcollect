package com.clickandcollect.backend.payment;

import com.clickandcollect.backend.order.OrderService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.model.Event;
import com.stripe.model.PaymentIntent;
import com.stripe.model.StripeObject;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentWebhookController {

    private final OrderService orderService;

    @Value("${stripe.webhook-secret}")
    private String webhookSecret;

    @PostMapping("/webhook")
    public ResponseEntity<String> handleWebhook(@RequestHeader("Stripe-Signature") String signatureHeader,
                                                 @org.springframework.web.bind.annotation.RequestBody String payload) {
        Event event;
        try {
            event = Webhook.constructEvent(payload, signatureHeader, webhookSecret);
        } catch (SignatureVerificationException e) {
            return ResponseEntity.badRequest().body("Signature invalide");
        }

        StripeObject stripeObject = event.getDataObjectDeserializer().getObject().orElse(null);

        if (stripeObject instanceof PaymentIntent paymentIntent) {
            if ("payment_intent.succeeded".equals(event.getType())) {
                orderService.markOrderPaid(paymentIntent.getId());
            } else if ("payment_intent.payment_failed".equals(event.getType())) {
                orderService.markOrderFailed(paymentIntent.getId());
            }
        }

        return ResponseEntity.ok("");
    }
}

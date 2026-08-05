package com.clickandcollect.backend.order;

public class SlotFullException extends RuntimeException {

    public SlotFullException(String message) {
        super(message);
    }
}

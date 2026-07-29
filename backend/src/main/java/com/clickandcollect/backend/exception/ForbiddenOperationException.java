package com.clickandcollect.backend.exception;

public class ForbiddenOperationException extends RuntimeException{

    public ForbiddenOperationException(String message){
        super(message);
    }
}

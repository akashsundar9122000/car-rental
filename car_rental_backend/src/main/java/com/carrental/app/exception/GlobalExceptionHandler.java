package com.carrental.app.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<String> handleException(Exception e) {
        e.printStackTrace();
        String message = e.getMessage();
        if (e.getCause() != null) {
            message += " | Cause: " + e.getCause().getMessage();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(message);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e) {
        e.printStackTrace();
        if ("Invalid credentials".equals(e.getMessage()) || "User not found".equals(e.getMessage())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
        if ("Email already in use".equals(e.getMessage())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
        }

        String message = e.getMessage();
        if (e.getCause() != null) {
            message += " | Cause: " + e.getCause().getMessage();
        }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(message);
    }
}

package com.carrental.app.dto;

public class DeleteCarRequest {
    private String password;

    public DeleteCarRequest() {
    }

    public DeleteCarRequest(String password) {
        this.password = password;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}

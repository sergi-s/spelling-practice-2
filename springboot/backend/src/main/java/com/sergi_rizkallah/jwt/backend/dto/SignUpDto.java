package com.sergi_rizkallah.jwt.backend.dto;

public record SignUpDto (String firstName, String lastName, String login, char[] password) { }

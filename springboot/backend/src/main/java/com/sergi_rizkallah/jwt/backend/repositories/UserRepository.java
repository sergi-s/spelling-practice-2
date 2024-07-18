package com.sergi_rizkallah.jwt.backend.repositories;

import com.sergi_rizkallah.jwt.backend.entities.User;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByLogin(String login);
}

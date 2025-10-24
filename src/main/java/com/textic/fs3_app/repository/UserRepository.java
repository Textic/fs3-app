package com.textic.fs3_app.repository;

import com.textic.fs3_app.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
}

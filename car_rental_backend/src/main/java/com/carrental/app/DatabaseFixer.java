package com.carrental.app;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.UUID;

@Component
public class DatabaseFixer implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseFixer(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) throws Exception {
        System.out.println("Running Database Fixer...");

        try {
            // Find default admin
            String findAdminSql = "SELECT id FROM admins WHERE email = 'admin@admin.com' LIMIT 1";
            UUID adminId = jdbcTemplate.queryForObject(findAdminSql, UUID.class);

            if (adminId != null) {
                // Update cars to belong to admin
                String updateCarsSql = "UPDATE cars SET admin_id = ? WHERE admin_id IS NULL";
                int rowsUpdated = jdbcTemplate.update(updateCarsSql, adminId);
                System.out.println("Updated " + rowsUpdated + " cars to belong to admin: " + adminId);
            } else {
                System.out.println("Default admin not found.");
            }
        } catch (Exception e) {
            System.err.println("Error running database fix: " + e.getMessage());
        }
    }
}

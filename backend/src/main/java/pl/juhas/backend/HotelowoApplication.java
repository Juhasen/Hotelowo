package pl.juhas.backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import pl.juhas.backend.auth.AuthenticationService;
import pl.juhas.backend.auth.RegisterRequest;

import static pl.juhas.backend.user.Role.ADMIN;

@SpringBootApplication
public class HotelowoApplication {

    public static void main(String[] args) {
        SpringApplication.run(HotelowoApplication.class, args);
    }

    @Bean
    public CommandLineRunner commandLineRunner(
            AuthenticationService service
    ) {
        return args -> {
            var admin = RegisterRequest.builder()
                    .firstname("Admin")
                    .lastname("Admin")
                    .email("admin@mail.com")
                    .password("password")
                    .role(ADMIN)
                    .build();
            System.out.println("Admin token: " + service.register(admin).getAccessToken());

        };
    }

}

package pl.juhas.backend.user;
import pl.juhas.backend.user.dto.UserResponse;

public class UserMapper {
    // Metoda pomocnicza zwracająca UserResponse
    public static UserResponse toResponse(User user) {
        return new UserResponse(
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getRole()
        );
    }
}

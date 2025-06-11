package pl.juhas.backend.address;

public class AddressMapper {

    public static AddressDTO mapToAddressDTO(Address address) {
        if (address == null) {
            return null;
        }
        return new AddressDTO(
            address.getStreet(),
            address.getCity(),
            address.getPostalCode(),
            address.getLatitude(),
            address.getLongitude()
        );
    }
}

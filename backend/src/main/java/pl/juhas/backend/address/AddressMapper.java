package pl.juhas.backend.address;

import pl.juhas.backend.address.dto.AddressRequest;

public class AddressMapper {

    public static AddressRequest mapToAddressDTO(Address address) {
        if (address == null) {
            return null;
        }
        return new AddressRequest(
            address.getCountry(),
            address.getStreet(),
            address.getCity(),
            address.getPostalCode(),
            address.getLatitude(),
            address.getLongitude()
        );
    }
}

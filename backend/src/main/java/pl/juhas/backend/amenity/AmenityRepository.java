package pl.juhas.backend.amenity;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface AmenityRepository extends JpaRepository<Amenity, Integer> {
    @Query("SELECT a FROM Amenity a WHERE a.id IN :ids")
    List<Amenity> findAmenitiesByIds(Integer[] ids);
}

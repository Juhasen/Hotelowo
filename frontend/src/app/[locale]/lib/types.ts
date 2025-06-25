export interface Hotel {
    id: number;
    name: string;
    mainImageUrl?: string;
    rating: number;
    oneNightPrice: number;
    stars: number;
    latitude: number;
    longitude: number;
}

export interface Page {
    content: Hotel[];
    pageable: {
        page: {
            size: number;
            number: number;
            totalElements: number;
            totalPages: number;
        }
    }
}

export type Address = {
    country: string;
    street: string;
    city: string;
    postalCode: string;
    latitude: number;
    longitude: number;
};

export type ImageType = {
    filePath: string;
    altText: string;
    isPrimary: boolean;
};

export type Amenity = {
    name: string;
    icon: string;
}

export type Review = {
    firstname: string;
    lastname: string;
    rating: number;
    comment: string;
}

export type HotelDetail = {
    name: string;
    description: string;
    phone: string;
    email: string;
    website: string;
    address: Address;
    isAvailableSearch: boolean;
    amenities: Amenity[];
    images: ImageType[];
    rating: number;
    stars: number;
    reviews: Review[];
};

export type Room = {
    number: string;
    type: string;
    capacity: number;
    pricePerNight: number;
    totalPrice: number;
}

export type Guest = {
    firstname: string;
    lastname: string;
    email: string;
    phoneNumber: string;
};

export type ReservationOverview = {
    id: number;
    hotelName: string;
    hotelImageUrl: string;
    roomType: string;
    checkInDate: string;
    checkOutDate: string;
    totalPrice: number;
    status: string;
}
export interface Hotel {
    id: number;
    name: string;
    mainImageUrl?: string;
    rating: number;
    oneNightPrice: number;
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
};
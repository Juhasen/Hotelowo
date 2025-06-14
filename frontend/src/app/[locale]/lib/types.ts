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
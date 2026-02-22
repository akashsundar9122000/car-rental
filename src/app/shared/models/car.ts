export interface CarVariant {
    id: string;
    name: string;
    transmission: 'Automatic' | 'Manual' | 'AMT' | 'DCT' | 'iMT';
    fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'CNG';
    seats: number;
    pricePerDay: number;
    mileage: string;
    features: string[];
    driveType?: 'RWD' | 'FWD' | '4x4' | '4x2';
    engineCapacity?: string;
    car?: Car;
}

export interface Admin {
    id: string;
    email: string;
    fullName: string;
}

export interface Car {
    id: string;
    name: string;
    brand: string;
    imageUrl: string;
    description: string;
    variants: CarVariant[];
    defaultVariantId: string;
    admin?: Admin;
}

export interface CarScrapeResult {
    imageUrl: string;
    description: string;
    variants: CarVariant[];
}

import { Injectable, signal } from '@angular/core';
import { Car, CarVariant } from '../models/car';

@Injectable({
  providedIn: 'root'
})
export class CarService {
  private cars: Car[] = [
    {
      id: '1',
      name: 'Nexon EV',
      brand: 'Tata',
      imageUrl: 'https://cdni.autocarindia.com/ExtraImages/20230118124412_Nexon%20EV%20Max%20static%20front%20three%20quarter%20_1_.jpg',
      description: 'India\'s best-selling electric SUV with enhanced range and safety features.',
      defaultVariantId: '1-lr',
      variants: [
        {
          id: '1-mr',
          name: 'Medium Range (30kWh)',
          transmission: 'Automatic',
          fuelType: 'Electric',
          seats: 5,
          pricePerDay: 2200,
          mileage: '325 km/charge',
          features: ['Sunroof', 'Ventilated Seats', 'Wireless Charger', '360 Camera'],
          engineCapacity: '30 kWh Battery'
        },
        {
          id: '1-lr',
          name: 'Long Range (45kWh)',
          transmission: 'Automatic',
          fuelType: 'Electric',
          seats: 5,
          pricePerDay: 2500,
          mileage: '465 km/charge',
          features: ['Sunroof', 'Ventilated Seats', 'Wireless Charger', '360 Camera', 'ADAS'],
          engineCapacity: '45 kWh Battery'
        }
      ]
    },
    {
      id: '2',
      name: 'Thar',
      brand: 'Mahindra',
      imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/13/Mahindra_Thar_Photoshoot_At_Perupalem_Beach_%28West_Godavari_District%2CAP%2CIndia_%29_Djdavid.jpg',
      description: 'The ultimate off-road icon. Go anywhere, do anything.',
      defaultVariantId: '2-diesel-4x4-auto',
      variants: [
        {
          id: '2-petrol-rwd-manual',
          name: 'Petrol RWD Manual',
          transmission: 'Manual',
          fuelType: 'Petrol',
          seats: 4,
          pricePerDay: 3500,
          mileage: '15.2 kmpl',
          features: ['Convertible Top', 'Touchscreen Info', 'Adventure Ready'],
          driveType: 'RWD',
          engineCapacity: '2.0L Turbo Petrol'
        },
        {
          id: '2-petrol-4x4-auto',
          name: 'Petrol 4x4 Automatic',
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seats: 4,
          pricePerDay: 4200,
          mileage: '14.8 kmpl',
          features: ['4x4 Drive', 'Convertible Top', 'Touchscreen Info', 'Adventure Ready'],
          driveType: '4x4',
          engineCapacity: '2.0L Turbo Petrol'
        },
        {
          id: '2-diesel-rwd-manual',
          name: 'Diesel RWD Manual',
          transmission: 'Manual',
          fuelType: 'Diesel',
          seats: 4,
          pricePerDay: 3200,
          mileage: '18.6 kmpl',
          features: ['Convertible Top', 'Touchscreen Info', 'Adventure Ready'],
          driveType: 'RWD',
          engineCapacity: '1.5L Diesel'
        },
        {
          id: '2-diesel-4x4-manual',
          name: 'Diesel 4x4 Manual',
          transmission: 'Manual',
          fuelType: 'Diesel',
          seats: 4,
          pricePerDay: 3800,
          mileage: '15.2 kmpl',
          features: ['4x4 Drive', 'Convertible Top', 'Touchscreen Info', 'Adventure Ready'],
          driveType: '4x4',
          engineCapacity: '2.2L Diesel'
        },
        {
          id: '2-diesel-4x4-auto',
          name: 'Diesel 4x4 Automatic',
          transmission: 'Automatic',
          fuelType: 'Diesel',
          seats: 4,
          pricePerDay: 4000,
          mileage: '14.4 kmpl',
          features: ['4x4 Drive', 'Convertible Top', 'Touchscreen Info', 'Adventure Ready', 'Cruise Control'],
          driveType: '4x4',
          engineCapacity: '2.2L Diesel'
        }
      ]
    },
    {
      id: '3',
      name: 'Swift',
      brand: 'Maruti Suzuki',
      imageUrl: 'https://i0.wp.com/bestsellingcarsblog.com/wp-content/uploads/2022/06/Suzuki-Swift-South-Africa-May-2022.jpeg?resize=600%2C400',
      description: 'Sporty, stylish, and fun to drive. The perfect city hatchback.',
      defaultVariantId: '3-petrol-manual',
      variants: [
        {
          id: '3-petrol-manual',
          name: 'Petrol Manual',
          transmission: 'Manual',
          fuelType: 'Petrol',
          seats: 5,
          pricePerDay: 1500,
          mileage: '22.38 kmpl',
          features: ['Fuel Efficient', 'Sporty Design', 'SmartPlay Studio', 'Cruise Control'],
          engineCapacity: '1.2L Petrol'
        },
        {
          id: '3-petrol-amt',
          name: 'Petrol AMT',
          transmission: 'AMT',
          fuelType: 'Petrol',
          seats: 5,
          pricePerDay: 1700,
          mileage: '22.56 kmpl',
          features: ['Fuel Efficient', 'Sporty Design', 'SmartPlay Studio', 'Cruise Control', 'Auto Gear Shift'],
          engineCapacity: '1.2L Petrol'
        }
      ]
    },
    {
      id: '4',
      name: 'XUV700',
      brand: 'Mahindra',
      imageUrl: 'https://images.hindustantimes.com/auto/img/2024/01/15/600x338/2024_XUV700_1705319660660_1705319664328.jpeg',
      description: 'A rush of adrenaline. Advanced technology meets powerful performance.',
      defaultVariantId: '4-diesel-auto',
      variants: [
        {
          id: '4-diesel-manual',
          name: 'Diesel Manual 7-Seater',
          transmission: 'Manual',
          fuelType: 'Diesel',
          seats: 7,
          pricePerDay: 3200,
          mileage: '16.5 kmpl',
          features: ['ADAS Level 2', 'Skyroof', 'Dual HD Screens', 'Sony 3D Audio'],
          engineCapacity: '2.2L Diesel'
        },
        {
          id: '4-diesel-auto',
          name: 'Diesel Automatic 7-Seater',
          transmission: 'Automatic',
          fuelType: 'Diesel',
          seats: 7,
          pricePerDay: 3500,
          mileage: '14.5 kmpl',
          features: ['ADAS Level 2', 'Skyroof', 'Dual HD Screens', 'Sony 3D Audio', 'AWD'],
          driveType: '4x4',
          engineCapacity: '2.2L Diesel'
        }
      ]
    },
    {
      id: '5',
      name: 'Fortuner',
      brand: 'Toyota',
      imageUrl: 'https://fortune-toyota.com/wp-content/uploads/2024/03/Fortuner-features-banner.webp',
      description: 'Dominate every terrain with style and power. The symbol of prestige.',
      defaultVariantId: '5-diesel-4x4',
      variants: [
        {
          id: '5-diesel-4x2',
          name: 'Diesel 4x2 Automatic',
          transmission: 'Automatic',
          fuelType: 'Diesel',
          seats: 7,
          pricePerDay: 4500,
          mileage: '14.4 kmpl',
          features: ['Ventilated Seats', 'Connected Car Tech', 'Premium Audio'],
          driveType: '4x2',
          engineCapacity: '2.8L Diesel'
        },
        {
          id: '5-diesel-4x4',
          name: 'Diesel 4x4 Automatic',
          transmission: 'Automatic',
          fuelType: 'Diesel',
          seats: 7,
          pricePerDay: 5000,
          mileage: '13.8 kmpl',
          features: ['4x4 Sigma 4', 'Ventilated Seats', 'Connected Car Tech', 'Premium Audio'],
          driveType: '4x4',
          engineCapacity: '2.8L Diesel'
        }
      ]
    },
    {
      id: '6',
      name: 'Virtus',
      brand: 'Volkswagen',
      imageUrl: 'https://preview.redd.it/need-help-in-price-negotiation-for-my-volkswagen-virtus-v0-nvrkdxxa3yyc1.jpeg?auto=webp&s=a0e2cd2b82e1ebc5661c161d54427afefe19d51e',
      description: 'German engineering at its finest. Elegant, powerful, and safe.',
      defaultVariantId: '6-petrol-auto',
      variants: [
        {
          id: '6-petrol-manual',
          name: 'Petrol Manual',
          transmission: 'Manual',
          fuelType: 'Petrol',
          seats: 5,
          pricePerDay: 2500,
          mileage: '19.4 kmpl',
          features: ['TSI Engine', 'Ventilated Seats', 'Sunroof', 'Digital Cockpit'],
          engineCapacity: '1.0L TSI'
        },
        {
          id: '6-petrol-auto',
          name: 'Petrol Automatic',
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seats: 5,
          pricePerDay: 2800,
          mileage: '18.2 kmpl',
          features: ['TSI Engine', 'Ventilated Seats', 'Sunroof', 'Digital Cockpit', 'DSG Gearbox'],
          engineCapacity: '1.5L TSI'
        }
      ]
    },
    {
      id: '7',
      name: 'Creta',
      brand: 'Hyundai',
      imageUrl: 'https://motor.ru/thumb/750x0/filters:quality(75)/imgs/2024/10/12/11/6622528/2957b64f89766144f70c0e503c0c0df4c6c274af.jpg',
      description: 'The ultimate SUV for the city and beyond.',
      defaultVariantId: '7-petrol-auto',
      variants: [
        {
          id: '7-petrol-manual',
          name: 'Petrol Manual',
          transmission: 'Manual',
          fuelType: 'Petrol',
          seats: 5,
          pricePerDay: 2000,
          mileage: '17.4 kmpl',
          features: ['Panoramic Sunroof', 'Bose Sound', 'BlueLink', 'Air Purifier'],
          engineCapacity: '1.5L Petrol'
        },
        {
          id: '7-petrol-auto',
          name: 'Petrol Automatic',
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seats: 5,
          pricePerDay: 2200,
          mileage: '16.8 kmpl',
          features: ['Panoramic Sunroof', 'Bose Sound', 'BlueLink', 'Air Purifier', 'CVT'],
          engineCapacity: '1.5L Petrol'
        },
        {
          id: '7-diesel-manual',
          name: 'Diesel Manual',
          transmission: 'Manual',
          fuelType: 'Diesel',
          seats: 5,
          pricePerDay: 2100,
          mileage: '21.4 kmpl',
          features: ['Panoramic Sunroof', 'Bose Sound', 'BlueLink', 'Air Purifier'],
          engineCapacity: '1.5L Diesel'
        },
        {
          id: '7-diesel-auto',
          name: 'Diesel Automatic',
          transmission: 'Automatic',
          fuelType: 'Diesel',
          seats: 5,
          pricePerDay: 2300,
          mileage: '18.5 kmpl',
          features: ['Panoramic Sunroof', 'Bose Sound', 'BlueLink', 'Air Purifier', 'Torque Converter'],
          engineCapacity: '1.5L Diesel'
        }
      ]
    },
    {
      id: '8',
      name: 'Carens',
      brand: 'Kia',
      imageUrl: 'https://imgd.aeplcdn.com/664x374/n/h2fj3cb_1726567.jpg?q=80',
      description: 'The perfect blend of style, space, and technology. A premium MPV for modern families.',
      defaultVariantId: '8-petrol-auto-7',
      variants: [
        {
          id: '8-petrol-manual-7',
          name: 'Petrol Manual 7-Seater',
          transmission: 'Manual',
          fuelType: 'Petrol',
          seats: 7,
          pricePerDay: 2200,
          mileage: '16.2 kmpl',
          features: ['Dual Sunroof', 'Ventilated Seats', '10.25" Touchscreen', 'Smart Pure Air Purifier'],
          engineCapacity: '1.5L Petrol'
        },
        {
          id: '8-petrol-auto-7',
          name: 'Petrol Automatic 7-Seater',
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seats: 7,
          pricePerDay: 2400,
          mileage: '15.8 kmpl',
          features: ['Dual Sunroof', 'Ventilated Seats', '10.25" Touchscreen', 'Smart Pure Air Purifier', 'iMT'],
          engineCapacity: '1.5L Petrol'
        },
        {
          id: '8-petrol-auto-6',
          name: 'Petrol Automatic 6-Seater',
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seats: 6,
          pricePerDay: 2500,
          mileage: '15.8 kmpl',
          features: ['Dual Sunroof', 'Captain Seats', 'Ventilated Seats', '10.25" Touchscreen', 'Smart Pure Air Purifier'],
          engineCapacity: '1.5L Petrol'
        },
        {
          id: '8-diesel-manual-7',
          name: 'Diesel Manual 7-Seater',
          transmission: 'Manual',
          fuelType: 'Diesel',
          seats: 7,
          pricePerDay: 2300,
          mileage: '21.3 kmpl',
          features: ['Dual Sunroof', 'Ventilated Seats', '10.25" Touchscreen', 'Smart Pure Air Purifier'],
          engineCapacity: '1.5L Diesel'
        },
        {
          id: '8-diesel-auto-7',
          name: 'Diesel Automatic 7-Seater',
          transmission: 'Automatic',
          fuelType: 'Diesel',
          seats: 7,
          pricePerDay: 2500,
          mileage: '18.9 kmpl',
          features: ['Dual Sunroof', 'Ventilated Seats', '10.25" Touchscreen', 'Smart Pure Air Purifier', 'Torque Converter'],
          engineCapacity: '1.5L Diesel'
        },
        {
          id: '8-diesel-auto-6',
          name: 'Diesel Automatic 6-Seater',
          transmission: 'Automatic',
          fuelType: 'Diesel',
          seats: 6,
          pricePerDay: 2600,
          mileage: '18.9 kmpl',
          features: ['Dual Sunroof', 'Captain Seats', 'Ventilated Seats', '10.25" Touchscreen', 'Smart Pure Air Purifier'],
          engineCapacity: '1.5L Diesel'
        }
      ]
    },
    {
      id: '9',
      name: 'Grand Vitara',
      brand: 'Maruti Suzuki',
      imageUrl: 'https://www.globalsuzuki.com/suzuki_family/automobile/img/202402-1/img06.jpg',
      description: 'India\'s first mass-market strong hybrid SUV. Combining efficiency with style.',
      defaultVariantId: '9-hybrid-auto',
      variants: [
        {
          id: '9-petrol-manual',
          name: 'Petrol Manual',
          transmission: 'Manual',
          fuelType: 'Petrol',
          seats: 5,
          pricePerDay: 2000,
          mileage: '21.11 kmpl',
          features: ['Panoramic Sunroof', 'Heads-Up Display', '360 Camera', 'Ventilated Seats'],
          engineCapacity: '1.5L Petrol'
        },
        {
          id: '9-petrol-auto',
          name: 'Petrol Automatic',
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seats: 5,
          pricePerDay: 2200,
          mileage: '20.58 kmpl',
          features: ['Panoramic Sunroof', 'Heads-Up Display', '360 Camera', 'Ventilated Seats', '6-Speed AT'],
          engineCapacity: '1.5L Petrol'
        },
        {
          id: '9-cng-manual',
          name: 'CNG Manual',
          transmission: 'Manual',
          fuelType: 'CNG',
          seats: 5,
          pricePerDay: 1900,
          mileage: '26.1 km/kg',
          features: ['Panoramic Sunroof', 'Heads-Up Display', '360 Camera', 'Factory-Fitted CNG'],
          engineCapacity: '1.5L CNG'
        },
        {
          id: '9-hybrid-auto',
          name: 'Strong Hybrid Automatic',
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seats: 5,
          pricePerDay: 2600,
          mileage: '27.97 kmpl',
          features: ['Strong Hybrid Tech', 'Panoramic Sunroof', 'Heads-Up Display', '360 Camera', 'Ventilated Seats', 'e-CVT'],
          engineCapacity: '1.5L Hybrid'
        },
        {
          id: '9-hybrid-awd',
          name: 'AllGrip (AWD) Hybrid',
          transmission: 'Automatic',
          fuelType: 'Petrol',
          seats: 5,
          pricePerDay: 2900,
          mileage: '27.97 kmpl',
          features: ['AllGrip AWD', 'Strong Hybrid Tech', 'Panoramic Sunroof', 'Heads-Up Display', '360 Camera', 'Ventilated Seats'],
          driveType: '4x4',
          engineCapacity: '1.5L Hybrid'
        }
      ]
    }
  ];

  getCars() {
    return signal(this.cars);
  }

  getCarById(id: string): Car | undefined {
    return this.cars.find(c => c.id === id);
  }

  getVariantById(carId: string, variantId: string): CarVariant | undefined {
    const car = this.getCarById(carId);
    return car?.variants.find(v => v.id === variantId);
  }

  getDefaultVariant(carId: string): CarVariant | undefined {
    const car = this.getCarById(carId);
    if (!car) return undefined;
    return car.variants.find(v => v.id === car.defaultVariantId);
  }
}

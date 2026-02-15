# Car Variant Selection Feature

## Overview
Add variant selection capability for each car, allowing users to choose transmission type, fuel type, and model variants. All specifications and pricing will update dynamically based on selected variant.

## Proposed Changes

### Data Model Updates

#### [MODIFY] [car.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/shared/models/car.ts)
- Add `CarVariant` interface with properties:
  - `id`, `name`, `transmission`, `fuelType`, `seats`, `pricePerDay`, `mileage`, `features`
- Update `Car` interface to include:
  - `variants: CarVariant[]`
  - `defaultVariantId: string`

#### [MODIFY] [car.ts (service)](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/shared/services/car.ts)
- Update all 8 cars with real variant data from CarWale:
  - **Nexon EV**: MR (30kWh), LR (45kWh) variants
  - **Thar**: Petrol/Diesel, Manual/Auto, RWD/4x4 combinations
  - **Swift**: Petrol Manual/AMT variants
  - **XUV700**: Diesel Manual/Auto, 7-seater variants
  - **Fortuner**: Diesel 4x2/4x4, Auto variants
  - **Virtus**: Petrol Manual/Auto variants
  - **Creta**: Petrol/Diesel, Manual/Auto/DCT variants
  - **Carens**: Petrol/Diesel, Manual/Auto/DCT, 6/7-seater variants

### UI Updates

#### [MODIFY] [car-detail.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/cars/car-detail/car-detail.ts)
- Add `selectedVariant` property
- Add `selectVariant(variantId: string)` method
- Update component to use selected variant specs

#### [MODIFY] [car-detail.html](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/cars/car-detail/car-detail.html)
- Add variant selector UI below car image
- Display variant options as buttons/cards
- Show transmission, fuel type, seating badges
- Update price, mileage, features dynamically

#### [MODIFY] [car-list.html](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/cars/car-list/car-list.html)
- Display default variant price
- Show "Multiple Variants" badge

### Booking Integration

#### [MODIFY] [booking.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/cars/booking/booking.ts)
- Accept `variantId` from route params
- Use selected variant for pricing calculation

## Verification Plan

### Manual Testing
1. Navigate to each car's detail page
2. Select different variants
3. Verify specs and price update correctly
4. Book a car with specific variant
5. Verify booking shows correct variant details in profile

# Car Rental Application Implementation Plan

## Goal Description
Develop a single-page application (SPA) using Angular for a car rental service. The aplication will feature a dashboard-style login/signup, a car listing page, and detailed views for each car.

## User Review Required
> [!NOTE]
> I will be using local mock data services for authentication and car data since no backend API was specified.

## Proposed Changes

### Project Structure
- `src/app/`
    - `auth/` (Login, Signup components)
    - `landing/` (New Public Landing Page)
    - `cars/` (Car List, Car Detail components)
    - `shared/` (Models, Services)

### Landing Page
- **LandingComponent**: Public entry point with Hero section, value propositions, and navigation to Login/Signup.
- **Route Updates**: Set root path to LandingComponent.

### Authentication
- **AuthService**: Manages user login state using `localStorage` to persist session.
- **LoginComponent**: "Car Dashboard" themed login form.
- **SignupComponent**: Registration form with similar theming.
- **AuthGuard**: Protects the car listing routes.

### Car Management
- **CarService**:
    - `getCars()`: Returns list of cars.
    - `getCarById(id)`: Returns detailed info.
- **Car Interface**:
    - `id`, `name`, `brand`, `pricePerDay`, `imageUrl`, `specs` (transmission, fuel, seats, etc.)

### UI/UX Design
- **Theme**: Dark/High-contrast mode inspired by modern car dashboards (speedometer visuals, digital font accents).
- **Navigation**:
    - Top bar with "Welcome [User]" and Logout button.

### Mileage & Sound Implementation
#### [MODIFY] [car.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/shared/services/car.ts)
- Add `mileage` property to `Car` interface.
- Update `cars` data with ARAI mileage stats (e.g., Nexon EV: 453km, Thar: 15.2kmpl).

#### [MODIFY] [car-detail.html](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/cars/car-detail/car-detail.html)
- Add a new "Mileage/Range" badge or section to the car detail card.

- Add `playEngineSound()` method.
- Use a `HTMLAudioElement` to play the sound on "Start Engine" button click.

### Booking Implementation
#### [NEW] [booking.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/cars/booking/booking.ts)
#### [NEW] [booking.html](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/cars/booking/booking.html)
- **Form Fields**: Source, Destination, Start Date, End Date, Driver Needed (Checkbox).
- **Theme**: Consistent Black/Red aesthetics.

#### [MODIFY] [app.routes.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/app.routes.ts)
- Add route: `path: 'cars/:id/book', component: BookingComponent`.

#### [MODIFY] [car-detail.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/cars/car-detail/car-detail.ts)
- Update `rentCar()` to navigate to the booking page instead of showing an alert.

### Booking Enhancements
#### [MODIFY] [booking.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/cars/booking/booking.ts)
- **Validators**:
    - `minDate`: Start date cannot be in the past.
    - `dateRange`: End date must be after start date.
- **Map Logic**:
    - Inject `DomSanitizer`.
    - Create `mapUrl` property.
    - Update URL dynamically when Source/Destination change.

#### [MODIFY] [booking.html](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/cars/booking/booking.html)
- **Validation UI**: Show error messages for invalid dates.
- **Map UI**: Add an iframe embedding Google Maps Directions.
- **Price Display**: Show calculated total amount.
- **Cost Breakdown**: Show Car Cost, Driver Cost (if selected), and Grand Total.
- **Confirmation View**: Show success message and "Back to Home" button after submission.

#### [MODIFY] [booking.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/cars/booking/booking.ts)
- **State**: Add `isBooked` flag.
- **Submission**: On valid submit, set `isBooked = true` instead of alert/redirect.

#### [MODIFY] [booking.html](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/cars/booking/booking.html)
- **Conditional Rendering**:
    - If `!isBooked`: Show Booking Form.
    - If `isBooked`: Show Success Message ("Yayy!!! your booking as been confirmed...") and "Back to Home" button.

### Profile & Booking History
#### [NEW] [booking.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/shared/services/booking.ts)
- **Service**: `BookingService` to manage booking state (using signals or behavior subject).
- **Model**: `Booking` interface.

#### [NEW] [profile.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/profile/profile.ts)
- **Component**: `ProfileComponent`.
- **Logic**: Fetch user's bookings from `BookingService`.

#### [NEW] [profile.html](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/profile/profile.html)
- **UI**: Display list of past bookings (Car image, name, dates, total cost, status).
- **Status**: Show "Payment Pending" (default).

#### [MODIFY] [booking.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/cars/booking/booking.ts)
- **Integration**: Inject `BookingService`.
- **Action**: On `onSubmit`, add booking to service.
- **Navigation**: Update "Back to Home" to navigate to `/cars`.

#### [MODIFY] [app.html](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/app.html)
- **Navbar**: Add Profile icon (top right). Links to `/profile`.

#### [MODIFY] [app.routes.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/app.routes.ts)
- **Route**: Add `profile` route.

### Landing Page Refinement
#### [MODIFY] [landing.html](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/landing/landing.html)
- **Button**: Remove "View Fleet" button.
- **Audio**: Ensure "Start Engine" button plays sound (already implemented in `landing.ts`).

### Authentication Enhancement
#### [MODIFY] [auth.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/shared/services/auth.ts)
- **Model**: Update `User` interface to include `mobileNumber`.
- **Logic**: Update `login` to use `email` and `password`.

#### [MODIFY] [login.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/auth/login/login.ts) & [login.html](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/auth/login/login.html)
- **Fields**: Switch `username` to `email`.
- **Validation**: Email format, Required.

#### [MODIFY] [signup.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/auth/signup/signup.ts) & [signup.html](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/auth/signup/signup.html)
- **Fields**: Add `mobileNumber` and `confirmPassword`.
- **Validation**:
    - `email`: Email format.
    - `mobileNumber`: 10 digits.
    - `password`: Min length 6.
    - `confirmPassword`: Must match `password`.

### Payment Flow
#### [NEW] [payment.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/payment/payment.ts) & [payment.html](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/payment/payment.html)
- **Component**: `PaymentComponent`.
- **Logic**:
    - Get `bookingId` from route.
    - Display dummy payment UI (Credit Card form or processing spinner).
    - `setTimeout` (5 seconds) -> Call `BookingService.updateStatus(id, 'Paid')`.
    - Redirect to `/cars`.

#### [MODIFY] [booking.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/shared/services/booking.ts)
- **Method**: `updateBookingStatus(id: string, status: 'Payment Pending' | 'Paid' | 'Completed')`.

#### [MODIFY] [profile.html](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/profile/profile.html)
- **Link**: Update "Pay Now" to link to `/payment/:id`.

#### [MODIFY] [app.routes.ts](file:///Users/akash/.gemini/antigravity/scratch/car_rental_app/src/app/app.routes.ts)
- **Route**: Add `payment/:id` route.
- **Price Logic**:
    - Calculate duration in days (ceiling of hours/24).
    - `carCost = duration * car.pricePerDay`.
    - `driverCost = isDriverNeeded ? duration * 500 : 0`.
    - `totalPrice = carCost + driverCost`.
    - Update on date changes or driver checkbox toggle.

## Verification Plan

### Automated Tests
- Run `ng test` to ensure components create successfully.

### Manual Verification
- **Login Flow**:
    1. Open App -> Redirect to Login.
    2. Enter credentials -> Redirect to Home.
    3. Verify "Welcome [Name]" display.
- **Car Listing**:
    1. Verify list of cars is displayed with images and prices.
    2. Click a car -> Navigate to Detail page.
- **Car Detail**:
    1. Verify all car attributes are shown.
    2. Click "Rent" -> Logic placeholder (alert or console log).
    3. Click "Back" -> Return to list.

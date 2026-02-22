import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule],
    templateUrl: './landing.html',
    styleUrl: './landing.css'
})
export class LandingComponent {
    private router = inject(Router);

    topTrends = [
        { name: 'Porsche 911', brand: 'Porsche', type: 'Sport', price: '650', image: 'https://images.unsplash.com/photo-1503376713284-5a6fb8ea661c?w=800&q=80', rating: 5.0, trips: 142 },
        { name: 'Toyota Supra', brand: 'Toyota', type: 'Coupe', price: '320', image: 'https://images.unsplash.com/photo-1620882772552-320dae0026e9?w=800&q=80', rating: 4.8, trips: 89 },
        { name: 'Audi R8', brand: 'Audi', type: 'Sport', price: '700', image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800&q=80', rating: 4.9, trips: 210 }
    ];

    popularVehicles = [
        { name: 'Mercedes G-Wagon', brand: 'Mercedes', type: 'SUV', price: '500', image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=800&q=80', rating: 4.7 },
        { name: 'Tesla Model S', brand: 'Tesla', type: 'Electric', price: '250', image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80', rating: 4.9 },
    ];

    navigateToLogin() {
        this.playEngineSound();
        // Brief delay to let the engine roar before changing views
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 600);
    }

    searchCars() {
        this.playEngineSound();
        setTimeout(() => {
            this.router.navigate(['/cars']);
        }, 600);
    }

    playEngineSound() {
        // Using local audio file from public/audio folder
        const audio = new Audio('/audio/freesound_community-car-ignition-and-idle-30965.mp3');
        audio.volume = 0.5;

        let fadeInterval: any = null;

        // Hard stop at 3 seconds for mobile browsers
        const stopAudio = () => {
            if (fadeInterval) {
                clearInterval(fadeInterval);
            }
            audio.pause();
            audio.currentTime = 0;
            audio.src = ''; // Release audio resource
        };

        // Ensure audio stops at 3 seconds maximum
        audio.addEventListener('timeupdate', () => {
            if (audio.currentTime >= 3) {
                stopAudio();
            }
        });

        // Play audio immediately
        audio.play().catch(err => console.error('Error playing sound:', err));

        // Smooth fade-out starting at 2.5 seconds
        setTimeout(() => {
            fadeInterval = setInterval(() => {
                if (audio.currentTime >= 3 || audio.volume <= 0.05) {
                    stopAudio();
                } else {
                    audio.volume = Math.max(0, audio.volume - 0.1);
                }
            }, 50);
        }, 2500);

        // Backup: Force stop after 3.1 seconds
        setTimeout(() => {
            stopAudio();
        }, 3100);
    }
}

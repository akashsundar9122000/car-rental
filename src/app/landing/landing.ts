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

    playEngineSound() {
        // Using local audio file from public/audio folder
        const audio = new Audio('/audio/freesound_community-car-ignition-and-idle-30965.mp3');
        audio.volume = 0.5;

        // Play audio immediately
        audio.play().catch(err => console.error('Error playing sound:', err));

        // Navigate to login after 2 seconds
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 2000);

        // Smooth fade-out starting at 2.5 seconds
        setTimeout(() => {
            const fadeInterval = setInterval(() => {
                if (audio.volume > 0.05) {
                    audio.volume = Math.max(0, audio.volume - 0.1);
                } else {
                    audio.pause();
                    audio.currentTime = 0;
                    clearInterval(fadeInterval);
                }
            }, 50);
        }, 2500);
    }
}

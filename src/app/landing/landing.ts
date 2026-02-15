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

        // Navigate to login after 2 seconds
        setTimeout(() => {
            this.router.navigate(['/login']);
        }, 2000);

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

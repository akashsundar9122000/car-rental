import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    isDarkMode = signal<boolean>(false);

    constructor() {
        this.initTheme();

        // Use effect to reactively sync signal to DOM
        effect(() => {
            const isDark = this.isDarkMode();
            if (isDark) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        });
    }

    toggleTheme() {
        this.isDarkMode.update(v => !v);
    }

    private initTheme() {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            this.isDarkMode.set(savedTheme === 'dark');
        } else {
            // Check system preference
            this.isDarkMode.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
    }
}

import { JetBrains_Mono, Karla } from "next/font/google";

export const karla = Karla({
    weight: ["400", "600", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

export const jetBrainsMono = JetBrains_Mono({
    weight: ["400", "700"],
    style: ["normal", "italic"],
    subsets: ["latin"],
});

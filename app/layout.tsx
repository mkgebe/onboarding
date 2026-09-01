import { Geist, Geist_Mono, Inter, Fraunces } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
})

// Editorial display serif used for marketing headlines (see globals.css
// `--font-serif`), kept separate from the app-wide Inter/Geist Mono pairing.
const fraunces = Fraunces({
    subsets: ["latin"],
    style: ["normal", "italic"],
    variable: "--font-display",
})

import { Toaster } from "sonner"


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn(
                "antialiased",
                fontMono.variable,
                "font-sans",
                inter.variable,
                fraunces.variable
            )}
        >
            <body>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange
                >
                    {children}
                    <Toaster position="top-right" richColors />
                </ThemeProvider>
            </body>
        </html>
    )
}

import i18next, { t } from "i18next";
import { ComponentChildren } from "preact";

export interface AppProps {
    readonly className?: string;
    readonly children: ComponentChildren;
}

export function App({ className, children }: AppProps) {
    return (
        <html lang={i18next.resolvedLanguage}>
            <head>
                <meta charSet="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" href="/styles/main.css" />
                <link rel="stylesheet" href="/styles/weather-icons.min.css" />
                <link rel="stylesheet" href="/styles/weather-icons-wind.min.css" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
                <link href="https://fonts.googleapis.com/css2?family=Rokkitt:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Kode+Mono:wght@400..700&family=Rokkitt:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
                <title>Outside</title>
            </head>
            <body className={className}>
                <main>
                    <h1>{t('appName')}</h1>
                    {children}
                    <footer>{t('appCopyright')}</footer>
                </main>
            </body>
        </html>
    );
}

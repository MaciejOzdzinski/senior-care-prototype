# CareMatch — Założenia architektoniczne

## Stack produkcyjny

```
Cloudflare Pages     →  hosting frontendu + CDN (szybko serwuje statyczne pliki)
.NET Core (Azure)    →  backend API (szybki, bez limitów, pełna moc C#)
Firebase FCM         →  push notifications (darmowe, bezlimitowe)
```

## Szczegóły

- **Frontend**: React 19 + TypeScript + Vite 7 + Tailwind CSS 4 (SPA)
- **Backend**: C# / ASP.NET Core Minimal API na Azure App Service (free tier F1 na start)
- **Push**: Firebase Cloud Messaging → obsługuje iOS (APNs) i Androida
- **Mobile**: Capacitor (opakowuje istniejący kod React w natywny WebView → App Store)
- **Baza danych**: do ustalenia (Azure SQL / PostgreSQL)
- **Auth**: do ustalenia

## Koszt na start: $0/msc (darmowe tiery wszystkich serwisów)

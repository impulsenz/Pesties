# Pestis - Enterprise Field Operations & Client Portal

Pestis is an offline-first enterprise field operations and pest management platform[cite: 1, 2]. It includes a robust field technician application for day-to-day service execution and a secure client portal for transparent customer reporting[cite: 1, 2].

## 🚀 Key Features

### Field Operations (`index.html`)
* **Offline-First Architecture**: Features robust local storage via IndexedDB and an intelligent sync queue so technicians can record data anywhere without losing connection[cite: 1].
* **Barcode & QR Scanning**: Integrated camera-based scanning and manual entry for fast device lookup[cite: 1].
* **Interactive Floor Plans**: Digital floor plans equipped with custom station pin placement and tracking[cite: 1].
* **Professional PDF Reports**: Instant generation of service reports and visit summaries powered by `jsPDF`[cite: 1].
* **Contract & Schedule Tracking**: Automated service scheduling, contract renewal tracking, and team role management[cite: 1].

### Client Portal (`client.html`)
* **Secure Authentication**: Supports magic link and Google OAuth sign-ins for client access[cite: 2].
* **Service Transparency**: Customers can view past service history, pest activity levels, and recommendations[cite: 2].
* **Audit Packs**: One-click downloadable PDF audit reports and site documentation[cite: 2].

## 🧰 Tech Stack

* **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript (ES6+)[cite: 1, 2]
* **Backend & Database**: Supabase (PostgreSQL, Row Level Security, and Authentication)[cite: 1, 2]
* **Storage**: Supabase Storage buckets for secure photo and site document management[cite: 1, 2]
* **Libraries**: `@supabase/supabase-js`, `html5-qrcode`, `jsPDF`[cite: 1, 2]

## ⚙️ Setup & Configuration

1. **Clone the repository** to your local environment.
2. **Configure Supabase**: Update your Supabase project URL and public anon key inside the configuration scripts in `index.html` and `client.html`[cite: 1, 2].
3. **Database Migrations**: Run the required Supabase SQL schema scripts to set up your tables, storage buckets, and security policies.
4. **Run Locally**: Serve the files using a local static server (such as the Live Server extension in VS Code).

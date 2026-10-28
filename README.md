# ERP-scaffbuild 🏗️⚡

A modern, comprehensive Enterprise Resource Planning (ERP) and Scaffolding/Shuttering Rental Management application built with React, Vite, Capacitor, and Supabase.

## 🚀 Features

- **Inventory Yard Management**: Real-time tracking of scaffolding assets, stock levels, yard movements, and condition status.
- **Rental Challans & Dispatch**: Dispatch and return note workflows with auto-calculated duration and rental rates.
- **GST Invoicing & Billing**: Full-featured Tax Invoice generation with automated CGST/SGST/IGST calculation and number-to-words currency formatting.
- **E-Way Bill & E-Invoice Generation**: Compliant JSON/PDF generation for NIC E-Way bill and IRN validation.
- **Area & Shuttering Calculator**: Built-in calculation engine for staging, shuttering areas, load calculations, and item estimation.
- **Role-Based Portals**:
  - **Owner / Admin Dashboard**: Financial summaries, quotation manager, company profile, and analytics.
  - **Contractor / Client Portal**: Challan history, active rentals, and pending balance overview.
  - **Worker / Yard Portal**: Streamlined mobile-friendly item check-in/out and yard operations.
- **Mobile & Android Support**: Packaged with Capacitor for native Android deployment.
- **Supabase Cloud Backend**: Real-time database sync, user auth, and SQL schema migrations.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind-compatible CSS design system, Lucide Icons
- **Mobile Framework**: Capacitor 7 (Android)
- **Database / Backend**: Supabase (PostgreSQL)
- **Tooling**: Oxlint

## 📦 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/NVN404/ERP-scaffbuild.git
   cd ERP-scaffbuild
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and fill in your Supabase credentials:
   ```bash
   cp .env.example .env
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

### 📱 Android Build

```bash
npx cap copy android
npx cap open android
```

## 📄 License

MIT

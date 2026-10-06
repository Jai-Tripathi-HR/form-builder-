# Corporate Garba 2026 — Employee & Guest Registration Web App

A production-ready, mobile-first event registration web application crafted with an Apple-level design philosophy: minimal, elegant, smooth, and intuitive.

Built with **Next.js (App Router) + React + TypeScript + Tailwind CSS + Framer Motion + SheetDB API**, optimized for fast loading and deployment to **Vercel**.

---

## 🌟 Key Features & User Experience

- **Apple-Inspired Design Language**:
  - Warm neutral off-white background (`#FAF9F6`), midnight navy headings (`#0B132B`), and restrained saffron/amber accents (`#EA580C`, `#D97706`).
  - Subtle background circular rhythm mandala motif that breathes gently without distraction.
  - Multi-layered soft diffused shadows, hairline borders, and glassmorphic card elements.
- **Cognitive-Load Free Multi-Step Flow**:
  1. **Welcome Screen**: Clean typography, event highlights card, and primary CTA.
  2. **Employee Details**: Work/personal email validation, 10-digit Indian mobile validation (`^[6-9][0-9]{9}$`), and subtle inline validation.
  3. **Guest Count Selection**: Large interactive cards (0 to 5 guests) with haptic scale feedback.
  4. **Guest Details (1 Step per Guest)**: Focused input flow with relationship pills (`Family`, `Friend`, `Colleague`, `Other`), individual contact info, and smooth progress tracking.
  5. **Review Screen**: High-density summary cards with direct 1-click edit shortcuts.
  6. **Celebratory Success Screen**: Confetti celebration, animated checkmark, custom generated `GARBA-XXXXXX` pass ID, 1-click copy, and pass print options.
- **Robust SheetDB Backend Integration**:
  - Next.js server-side API route (`/api/registration`) isolates backend logic and protects SheetDB endpoints.
  - Automatic column adaptation matching the spreadsheet schema:
    `registration_id`, `submitted_at`, `status`, `employee_name`, `employee_email`, `employee_phone`, `guest_count`, `guest_1_*` through `guest_5_*`.
  - Duplicate submission guard prevents accidental rapid double-clicks.
  - Comprehensive Zod validation on both client and server.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js (App Router) |
| **Language** | TypeScript |
| **UI Library** | React |
| **Styling** | Tailwind CSS |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Validation** | Zod + React Hook Form |
| **Celebration** | Canvas Confetti |
| **Database Backend** | SheetDB (Google Sheets REST API) |
| **Deployment Target** | Vercel |

---

## 📁 Project Architecture

```
├── app/
│   ├── api/
│   │   └── registration/
│   │       └── route.ts          # Server-side API handler (POST & GET diagnostics)
│   ├── globals.css               # Apple design tokens, glassmorphism, typography
│   ├── layout.tsx                # Root layout, metadata, viewport configuration
│   └── page.tsx                  # Home entry point rendering RegistrationWizard
├── components/
│   └── registration/
│       ├── FestiveBackground.tsx # Faint mandala geometry and warm ambient glows
│       ├── ProgressIndicator.tsx # Animated step progress bar and back navigation
│       ├── WelcomeScreen.tsx     # Hero landing with event cards and CTA
│       ├── EmployeeForm.tsx      # Step 1: Employee credentials and validation
│       ├── GuestCount.tsx        # Step 2: Interactive 0-5 guest selection cards
│       ├── GuestForm.tsx         # Step 3..N: 1 guest per step with relationship pills
│       ├── ReviewStep.tsx        # Step N+1: Review summary & edit links
│       ├── SuccessScreen.tsx     # Step N+2: Pass badge, confetti & copy ID
│       └── RegistrationWizard.tsx# State machine orchestrating the journey
├── lib/
│   ├── registration.ts           # ID generator (GARBA-XXXXXX), IST timestamp, cache
│   ├── sheetdb.ts                # SheetDB HTTP service & schema inspector
│   └── validation.ts             # Zod schemas for employee & guest data
├── types/
│   └── registration.ts           # Shared TypeScript interfaces & types
├── .env.example                  # Environment variables template
├── .env.local                    # Local environment config
└── README.md
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- **Node.js** v18.17+ or v20+ / v22+
- **npm** or **pnpm** / **yarn**

### 2. Clone and Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Set your SheetDB API URL in `.env.local`:
```env
SHEETDB_API_URL=https://sheetdb.io/api/v1/a5xism6f9pfnq
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📊 Google Sheets & SheetDB Configuration

The application is connected to SheetDB API endpoint:
`https://sheetdb.io/api/v1/a5xism6f9pfnq`

### Spreadsheet Headers (Row 1)
Ensure Row 1 of your connected Google Sheet contains the following columns:
```
registration_id, submitted_at, status, employee_name, employee_email, employee_phone, guest_count, guest_1_name, guest_1_phone, guest_1_email, guest_1_type, guest_2_name, guest_2_phone, guest_2_email, guest_2_type, guest_3_name, guest_3_phone, guest_3_email, guest_3_type, guest_4_name, guest_4_phone, guest_4_email, guest_4_type, guest_5_name, guest_5_phone, guest_5_email, guest_5_type
```

### Live Diagnostics
You can test the connectivity and inspect active columns at:
`GET /api/registration`

---

## 🏗️ Production Build

To verify that the application compiles without errors:
```bash
npm run build
```

To run the optimized production bundle locally:
```bash
npm run start
```

---

## ☁️ Vercel Deployment

This project is 100% Vercel-ready.

### Deploying via Vercel CLI
```bash
npx vercel
```

### Deploying via GitHub / Vercel Dashboard
1. Push this repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com/new), import the repository.
3. In **Project Settings** > **Environment Variables**, add:
   - **Key**: `SHEETDB_API_URL`
   - **Value**: `https://sheetdb.io/api/v1/a5xism6f9pfnq`
4. Click **Deploy**. Vercel will build and assign a production URL.

---

## 🔒 Security & Data Integrity

1. **Server-Side API Route**: The browser never writes directly to SheetDB; requests pass through `/api/registration`.
2. **Double Submission Guard**: In-memory rate limiting rejects duplicate submissions for the same employee email or phone within 60 seconds.
3. **Dual Validation**: Zod parses and sanitizes inputs on both client and server.
4. **Preserved Rows**: SheetDB requests strictly use append (`POST`) operations without modifying historical records.

---

## 🔮 Future Enhancements

- QR Code generation for the digital event pass.
- SMS / WhatsApp notification integration via Twilio or Gupshup for instant pass delivery.
- On-premise badge scanning check-in portal for security staff.

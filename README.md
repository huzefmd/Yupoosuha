# 🚀 Yupoosuha

**Yupoosuha** is a comprehensive financial literacy and smart shopping platform designed to help users master their money, understand the stock market, navigate insurance, and find the best shopping deals—all explained in plain, simple language.

## 🌟 Key Features

- **🎓 Free Learning**: Curated video series and guides to master the basics of investing and personal finance.
- **📈 Market Insights**: Real-time market indices and trending financial news to keep users updated.
- **🛡️ Insurance Guidance**: Simplified explanations and comparisons of various insurance types to help users find the right coverage.
- **💰 Finance Help**: Guidance on opening Demat accounts, managing loans, and other essential financial services.
- **🛍️ Smart Shopping**: A curated collection of top shopping platforms and the best deals available online.
- **🤖 AI Integration**: Powered by modern AI to provide a seamless and intelligent user experience.

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Routing & State**: TanStack Router, TanStack Start, TanStack Query
- **Backend/Database**: Supabase
- **UI Components**: Radix UI, Lucide React, Shadcn UI
- **Build Tool**: Vite

## 📂 Folder Structure

```text
yupoosuha/
├── assets/              # Images, logos, and static media
├── src/
│   ├── components/      # Reusable UI components (Navbar, Footer, etc.)
│   │   └── ui/          # Low-level primitive UI components (buttons, inputs)
│   ├── hooks/           # Custom React hooks for shared logic
│   ├── lib/             # Utility functions, API clients, and core business logic
│   │   ├── content.ts   # Content fetching and type definitions
│   │   └── theme-provider.tsx # Theme management logic
│   ├── routes/         # TanStack Router page definitions and layouts
│   │   ├── __root.tsx   # The root layout wrapper
│   │   └── index.tsx    # Home page implementation
│   ├── styles/          # Global CSS and Tailwind configurations
│   ├── start.ts         # Entry point for TanStack Start
│   └── server.ts        # Server-side logic and API handlers
├── public/              # Static files served as-is
├── package.json         # Project dependencies and scripts
└── tsconfig.json        # TypeScript configuration
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/yupoosuha.git
   cd yupoosuha
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

### Running the App

**Development Mode**:
Run the app locally with hot-reload:
```bash
npm run dev
```
The app will typically be available at `http://localhost:3000`.

**Production Build**:
To create an optimized production bundle:
```bash
npm run build
```

**Preview Build**:
To preview the production build locally:
```bash
npm run preview
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any bugs or feature requests.

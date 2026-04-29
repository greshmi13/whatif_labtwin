# WhatIf LabTwin

A virtual laboratory simulation platform for engineering students to conduct experiments across multiple disciplines with interactive visualizations and AI-powered insights.

## 🎯 Overview

WhatIf LabTwin is a web-based platform that brings hands-on lab experiences to life. Students can access virtual engineering labs covering Electrical, Electronics, Mechanical, and Civil Engineering, performing complex experiments with real-time calculations and visualizations without needing physical equipment.

### Key Features

- **Multi-Discipline Labs**: Access 25+ experiments across 4 engineering branches
- **Interactive Experiments**: Adjust parameters using intuitive sliders and see real-time results
- **What-If Scenarios**: Explore predefined scenarios to understand cause-and-effect relationships
- **Real-Time Visualizations**: Animated diagrams, graphs, and data tables
- **Progress Tracking**: Monitor completion status across labs and experiments
- **AI-Powered Insights**: Get explanations and warnings based on calculated results
- **Student Dashboard**: Centralized view of all available labs and personal progress

## 🏗️ Supported Departments & Labs

### ⚡ Electrical Engineering (EEE)
- **BEEE Lab** - 8 experiments
  - Ohm's Law Verification
  - Kirchhoff's Voltage Law (KVL)
  - Kirchhoff's Current Law (KCL)
  - Series & Parallel Configuration
  - Power Measurement
  - Superposition Theorem

### 📡 Electronics & Communication (ECE)
- **Analog Electronics Lab** - 6 experiments
  - Transistor CE Configuration
  - Diode Characteristics
  - Zener Regulator
  - Half-Wave Rectifier
  - CE Amplifier
  - Rectifier Analysis

### ⚙️ Mechanical Engineering (MECH)
- **Material Testing Lab** - 7 experiments
  - Tensile Test
  - Hardness Testing (BHN)
  - Impact Test
  - Compression Test

- **Fluid Mechanics & Hydraulics Lab** - 6 experiments
  - Bernoulli's Theorem
  - Reynolds Number Experiment
  - Venturi Meter
  - Pipe Friction Analysis

### 🏗️ Civil Engineering (CIVIL)
- **Surveying Lab** - 8 experiments
  - Chain Survey
  - Compass Survey
  - Leveling
  - Plane Table Survey

- **Concrete Technology Lab** - 5 experiments
  - Concrete Mix Design
  - Slump Test
  - Aggregate Grading
  - Cube Strength Test

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd whatif_labtwin-main

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
whatif_labtwin-main/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── layout/          # Layout components
│   │   ├── dashboard/       # Dashboard components
│   │   └── experiment/      # Experiment-specific components
│   ├── pages/               # Route pages
│   ├── contexts/            # React contexts (Auth, etc.)
│   ├── hooks/               # Custom React hooks
│   ├── data/                # Static data (departments, experiments)
│   ├── types/               # TypeScript type definitions
│   ├── lib/                 # Utility functions
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
├── package.json             # Dependencies
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Type Safety**: TypeScript
- **Build Tool**: Vite 6
- **UI Components**: shadcn/ui (Radix UI)
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Form Handling**: React Hook Form + Zod
- **State Management**: React Query + Context API
- **Visualization**: Recharts
- **Icons**: Lucide React
- **Other**: Date-fns, Class Variance Authority, Sonner (toast notifications)

## 🔐 Authentication

The application includes a simple authentication system with:
- Login page for existing students
- Registration for new students
- Department and year/semester selection
- Progress tracking per student

## 📊 Experiment Features

Each experiment includes:

1. **Parameters**: Adjustable input values with sliders
2. **Real-time Calculations**: Instant results based on parameter values
3. **Visualizations**: 
   - Animated circuit/apparatus diagrams
   - Characteristic graphs
   - Data observation tables
4. **What-If Scenarios**: Pre-defined parameter changes with expected outcomes
5. **AI Insights**: Explanations of results and warnings for unsafe conditions
6. **Demo Videos**: Optional video tutorials for each experiment

## 📈 Progress Tracking

Students can track their progress:
- Experiment status: Not Started → In Progress → Completed
- Lab completion percentage
- Department-wise progress overview
- Session persistence (data stored in browser context)

## 🎨 Customization

### Styling
- Tailwind CSS configuration: `tailwind.config.ts`
- Dark mode support via `next-themes`
- Color scheme aligned to department identity

### Adding New Experiments

1. Add experiment data to `src/data/departments.ts`
2. Create parameter definitions with units and ranges
3. Add calculation logic to `src/pages/Experiment.tsx`
4. (Optional) Create custom visualization components

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Create production build
npm run build:dev    # Build in development mode
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🔗 Deployment

This project can be deployed on:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Any static hosting service

Via Lovable platform:
1. Visit your Lovable project dashboard
2. Click Share → Publish
3. Follow the deployment instructions

To set up a custom domain:
1. Navigate to Project Settings → Domains
2. Click "Connect Domain"
3. See [Lovable Custom Domain Documentation](https://docs.lovable.dev/features/custom-domain)

## 🤝 Working Locally

### IDE Setup

**Using VS Code:**
1. Clone the repository
2. Open in VS Code
3. Install recommended extensions
4. Run `npm run dev` in terminal

**Using GitHub Codespaces:**
1. Navigate to repository main page
2. Click "Code" button → "Codespaces" tab
3. Click "New codespace"
4. Edit directly and push changes

**Direct GitHub Editing:**
1. Navigate to file
2. Click the edit (pencil) icon
3. Make changes and commit

## 📝 Git Workflow

Changes made locally via IDE will be reflected in the Lovable platform automatically when pushed to the repository. Similarly, changes made through Lovable will be committed automatically.

## ⚖️ License

This project is built with [Lovable](https://lovable.dev) - a full-stack development platform.

## 📞 Support & Feedback

For issues or feature requests:
- Create a GitHub issue in this repository
- Provide detailed description of the problem
- Include steps to reproduce (if applicable)

## 🔄 Syncing Changes

The repository is connected to Lovable. Any changes made through either platform will be synchronized:
- **IDE Changes**: Push to GitHub → Auto-reflected in Lovable
- **Lovable Changes**: Auto-committed to GitHub
- **GitHub Web Editor**: Commit changes → Auto-reflected in Lovable

---

**Made with ❤️ for engineering students**

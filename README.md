# Nexus Widget UI

A modern, interactive cryptocurrency deposit widget with QR code functionality and smooth animations.

## Demo

https://github.com/user-attachments/assets/your-demo-video.mp4

> Add your demo video link here

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) - React-based framework with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework
- **Animations:** [Motion](https://motion.dev/) - Production-ready animation library (Framer Motion)
- **UI Components:** [Radix UI](https://www.radix-ui.com/) - Unstyled, accessible component primitives
- **Icons:** [Lucide React](https://lucide.dev/) - Beautiful & consistent icon toolkit
- **Utilities:**
  - [clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge) - Conditional className utilities
  - [class-variance-authority](https://cva.style/) - Variant-driven component APIs
  - [usehooks-ts](https://usehooks-ts.com/) - React hooks collection
  - [react-use-measure](https://github.com/pmndrs/react-use-measure) - Element measurements

## Design Thoughts

This section documents key design decisions and considerations made during development:

### Animation Philosophy

- Prioritized performance with transform-based animations over position properties
- Used spring physics for natural, responsive interactions that feel alive
- Implemented origin-aware animations so elements appear from their trigger points

### Component Architecture

- Separated concerns between presentation and interaction logic
- Built reusable primitives that compose into complex interactions
- Maintained accessibility while enhancing with motion

> **Note:** Add more design thoughts and decisions as you continue development

## Features

- Interactive QR code generation and display
- Smooth state transitions with spring animations
- Multiple deposit methods (wallet transfer, fiat payment)
- Amount selection with real-time validation
- Responsive design with mobile-first approach
- Accessible UI components built on Radix primitives

## Getting Started

### Prerequisites

- Node.js 20+ or Bun
- npm, yarn, pnpm, or bun

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nexus-widget-ui.git
cd nexus-widget-ui

# Install dependencies
npm install
```

### Development

```bash
# Run the development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
nexus-widget-ui/
├── app/                  # Next.js App Router pages
├── components/           # React components
│   ├── ui/              # Reusable UI primitives
│   └── ...              # Feature components
├── lib/                 # Utility functions
└── public/              # Static assets
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ using Next.js and Motion

# Binance Order Book Replication

A real-time cryptocurrency order book application that replicates Binance's order book interface with live updates, interactive features, and smooth performance optimizations.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Modern web browser with WebSocket support

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in your terminal).

### Building for Production

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The production build will be in the `dist/` directory.

### Code Quality

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code with Prettier
npm run prettier:fix

# Format and lint (runs both)
npm run format
```

## 🏗️ Technology Choices

### Core Framework

- **React 19**
- **TypeScript**
- **Vite**

### State Management

- **Zustand** - Lightweight state management with built-in persistence
  - Used for order book data, UI settings, and market selection
  - Persists user preferences (market, decimal precision, visualization mode) to localStorage

### Data Fetching & Caching

- **@tanstack/react-query** - For the current feature it's not really mandatory, but I have included it because this is how I usually work. Efficient data fetching, caching, and synchronization.
  - Manages order book snapshots and ticker data
  - Automatic retries and background refetching

### UI Components & Styling

- **Tailwind CSS 4**
- **Radix UI**
- **Lucide React**
- **shadcn/ui**

I have chosen this combination because it's very easy to customize our components to any style and it's pretty light, compared with other options. Also, for me it's the fastest combination when developing.

### Real-time Communication

- **WebSocket API** - Native browser WebSocket for real-time order book updates
  - Connects to Binance WebSocket stream (`wss://stream.binance.com:9443/ws/`)

### Performance Optimization

- **@tanstack/react-virtual** - Virtual scrolling for efficient rendering of large order lists
  - Handles thousands of orders without performance degradation

### Internationalization

- **i18next & react-i18next** - Full i18n support
  - Currently supports English, easily extensible to other languages

### Additional Libraries

- **tailwind-merge** - Merge Tailwind classes intelligently
- **clsx** - Conditional className utility

## 📋 Assumptions

1. **Binance API Availability**: The application assumes Binance WebSocket and REST APIs are accessible and operational.

2. **Browser Support**:
   - Modern browsers with WebSocket support (all major browsers since 2011)
   - ES6+ JavaScript features
   - CSS Grid and Flexbox support

3. **Network**: Assumes stable internet connection for WebSocket streaming. The app includes error handling for connection issues but doesn't implement automatic reconnection (handled by Binance's infrastructure).

4. **Data Format**: Assumes Binance API response format remains consistent. Any changes to their API structure would require updates.

5. **Decimal Precision**: The order book supports decimal grouping (0.01, 0.1, 1, 10, 50, 100) as per Binance's standard options.

6. **Order Book Limits**: For the "both" tab, displays 17 bids and 17 asks (matching Binance's default). Virtualized lists show all available orders.

## ✨ Features

### Core Functionality

- ✅ Real-time order book updates via WebSocket
- ✅ Multiple market support (BTC, ETH, SOL/USDT pairs)
- ✅ Decimal precision grouping (0.01, 0.1, 1, 10, 50, 100)
- ✅ Depth visualization (Amount and Cumulative modes)
- ✅ Buy/Sell ratio calculation
- ✅ Current price display with direction indicators
- ✅ Settings persistence (localStorage)

### UI/UX Features

- ✅ Three view modes: Both (17 bids/asks), Bids only, Asks only
- ✅ Interactive hover highlighting (rows closest to center)
- ✅ Price change animations (red/green flash effects)
- ✅ Virtualized scrolling for large lists
- ✅ Rounding toggle for Amount and Total columns
- ✅ Responsive design
- ✅ Loading states with skeletons
- ✅ Internationalization support

## 🎯 Bonus Challenges Attempted

- Add tabs/filter by sell/buy orders
- Implemented virtual scrolling for handling thousands of orders efficiently
- Add internationalization (i18n support)
- Add localStorage persistence

## 📁 Project Structure

```
src/
├── api/              # API integration layer
│   └── orderBook/    # Order book API hooks and types
├── components/       # Reusable UI components
│   └── ui/          # shadcn/ui components
├── features/         # Feature-based components
│   └── OrderBook/   # Order book feature
├── hooks/           # Custom React hooks
├── stores/          # Zustand state stores
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── i18n/            # Internationalization
└── lib/             # Library configurations
```

## 🐛 Troubleshooting

### WebSocket Connection Issues

- Check browser console for connection errors
- Verify Binance API is accessible from your network
- Ensure WebSocket protocol is supported (not available over HTTP)

### Build Errors

- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

## 📝 License

This project is for educational/demonstration purposes.

## 🙏 Acknowledgments

- Binance for providing the public WebSocket and REST APIs
- shadcn/ui for the excellent component system
- All open-source contributors whose libraries made this project possible

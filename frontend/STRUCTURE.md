# ClimaSense Frontend - Structure

## Project Structure

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout with Header
│   ├── page.tsx             # Dashboard page
│   ├── page.css             # Dashboard styles
│   ├── globals.css          # Global styles
│   └── previsao/
│       ├── page.tsx         # Forecast page
│       └── page.css         # Forecast styles
├── components/
│   ├── layout/
│   │   ├── Header.tsx       # Navigation header
│   │   └── Header.css       # Header styles
│   ├── charts/              # Chart components (future)
│   └── cards/               # Card components (future)
├── services/
│   └── api.ts               # API client
├── styles/
│   ├── pages/               # Page-specific styles
│   └── components/          # Component-specific styles
├── public/                  # Static assets
├── .env.local               # Environment variables
├── .env.example             # Environment variables template
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## Architecture

### Pages

#### Dashboard (/)
- Displays current sensor reading
- Shows historical data (last 24 hours)
- Auto-refresh every 30 seconds
- Responsive table layout

#### Forecast (/previsao)
- Weather forecast for 7 days
- Temperature (max/min)
- Precipitation
- Wind speed
- Weather conditions

### Components

#### Header
- Navigation menu
- Links to Dashboard and Forecast
- Dark theme
- Responsive design

### Services

#### API Client
- `getSensorData()` - Fetch historical sensor data
- `getLatestReading()` - Fetch latest reading
- `getForecast()` - Fetch weather forecast
- Base URL configurable via environment variable

## Styling

### Approach
- Pure CSS (no frameworks)
- Separated by page and component
- CSS files colocated with components
- Responsive design
- Mobile-first approach

### Global Styles
- Reset and base styles in `globals.css`
- CSS variables for theming (future)
- Consistent spacing and typography

### Component Styles
- Each component has its own CSS file
- BEM-like naming convention
- Scoped to component

## Data Flow

```
User → Page Component → API Service → Backend API
                ↓
         State Management
                ↓
            UI Update
```

## Features

### Dashboard
- Real-time data display
- Historical data table
- Metric cards
- Auto-refresh
- Loading states
- Error handling

### Forecast
- 7-day forecast grid
- Location information
- Weather descriptions
- Temperature visualization
- Precipitation and wind data
- Responsive cards

## Configuration

### Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:21165
```

### Next.js Config

- App Router enabled
- TypeScript strict mode
- No Tailwind CSS
- No ESLint (custom setup)

## Development

### Running Locally

```bash
npm run dev
```

Access: `http://localhost:3001`

### Building

```bash
npm run build
npm run start
```

## API Integration

### Endpoints Used

- `GET /dados` - Historical sensor data
- `GET /dados/latest` - Latest reading
- `GET /previsao` - Weather forecast

### Data Types

```typescript
interface SensorReading {
  deviceId: string;
  temperatura: number;
  umidade: number;
  timestamp: string;
}

interface ForecastData {
  latitude: number;
  longitude: number;
  timezone: string;
  daily: DailyForecast[];
}
```

## State Management

- React hooks (useState, useEffect)
- No external state management library
- Local component state
- API calls in useEffect

## Error Handling

- Try-catch blocks in API calls
- Error state in components
- User-friendly error messages
- Loading states

## Responsive Design

### Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Mobile Optimizations

- Single column layouts
- Stacked cards
- Responsive tables
- Touch-friendly buttons

## Performance

### Optimizations

- Static page generation where possible
- Auto-refresh with intervals
- Efficient re-renders
- Image optimization (future)

### Loading States

- Loading indicators
- Skeleton screens (future)
- Progressive enhancement

## Accessibility

- Semantic HTML
- ARIA labels (future)
- Keyboard navigation
- Color contrast
- Focus indicators

## Future Improvements

- [ ] Add charts (temperature/humidity over time)
- [ ] Device selector
- [ ] Date range filters
- [ ] Data comparison
- [ ] Notifications
- [ ] Dark mode toggle
- [ ] PWA support
- [ ] Offline mode
- [ ] Export data
- [ ] Print styles

## Testing

- Unit tests (future)
- Integration tests (future)
- E2E tests (future)

## Deployment

### Vercel (Recommended)

```bash
vercel deploy
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3001
CMD ["npm", "start"]
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Dependencies

### Production

- next: ^16.2.4
- react: ^19.0.0
- react-dom: ^19.0.0

### Development

- @types/node
- @types/react
- @types/react-dom
- typescript

## Scripts

```bash
# Development
npm run dev

# Build
npm run build

# Production
npm run start

# Lint
npm run lint
```

## Troubleshooting

### API Connection Issues

1. Check backend is running
2. Verify API_URL in `.env.local`
3. Check CORS settings in backend

### Build Errors

1. Clear `.next` folder
2. Delete `node_modules`
3. Run `npm install`
4. Run `npm run build`

### Runtime Errors

1. Check browser console
2. Verify API responses
3. Check network tab
4. Verify environment variables

## Best Practices

### Code Organization

- One component per file
- Colocate styles with components
- Keep components small and focused
- Use TypeScript for type safety

### Styling

- Use CSS modules or separate CSS files
- Follow BEM naming convention
- Keep specificity low
- Use CSS variables for theming

### Performance

- Minimize re-renders
- Use React.memo when needed
- Optimize images
- Lazy load components

### Accessibility

- Use semantic HTML
- Add ARIA labels
- Ensure keyboard navigation
- Test with screen readers

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

# Implementation Plan: Interactive Market Indices and FII/DII Toggle

## Goals

1. Replace the static SVG `MiniChart` with an interactive `Recharts` `AreaChart`.
2. Implement working time range selection ('1D', '1W', '1M', '3M', '1Y').
3. Implement a working toggle between 'FII Cash' and 'DII Cash' with dynamic data updates.
4. Ensure all visualizations follow the `dataviz` skill (clean, professional, responsive).

## Technical Approach

### 1. State Management

In `MarketIndices` component, add:

- `const [timeRange, setTimeRange] = useState('1D');`
- `const [institutionalType, setInstitutionalType] = useState<'FII' | 'DII'>('FII');`

### 2. Mock Data Structure

Create constants outside the component to simulate historical data:

- `MOCK_INDICES_DATA`:
  ```ts
  const MOCK_INDICES_DATA = {
    '1D': [{ date: '09:00', value: 24420 }, ...],
    '1W': [{ date: 'Mon', value: 24100 }, ...],
    '1M': [{ date: '01 Oct', value: 23800 }, ...],
    '3M': [...],
    '1Y': [...]
  };
  ```
- `MOCK_CASH_FLOW_DATA`:
  ```ts
  const MOCK_CASH_FLOW_DATA = {
    'FII': {
      value: "-341.25 Cr.",
      date: "05 Sept 2026",
      bars: [{ day: "27", value: -820 }, ...]
    },
    'DII': {
      value: "+1,240.10 Cr.",
      date: "05 Sept 2026",
      bars: [{ day: "27", value: 420 }, ...]
    }
  };
  ```

### 3. Component Refactorings

#### A. `FlowBars` Component

- Update `FlowBars` to accept `data` prop: `function FlowBars({ data }: { data: { day: string, value: number }[] })`.
- Remove hardcoded `flowData`.

#### B. `InteractiveChart` Component (Replacing `MiniChart`)

- Use `ChartContainer` from `@/components/ui/chart`.
- Define `chartConfig` for colors.
- Use `ResponsiveContainer` $\rightarrow$ `AreaChart`.
- Implement `Area` with a gradient fill and thin stroke.
- Implement `XAxis` and `YAxis` with recessive styling (or hide them and use tooltips for precision).
- Implement `ChartTooltip` with `ChartTooltipContent`.
- Logic to switch data based on `timeRange`.

#### C. `MarketIndices` Main Component

- **Time Range Buttons**: Update `onClick` to call `setTimeRange(range)` and update the active class based on `timeRange === range`.
- **FII/DII Tabs**: Update `onClick` to call `setInstitutionalType(type)` and update active styles.
- **Value Display**: Update the cash flow value and date based on `MOCK_CASH_FLOW_DATA[institutionalType]`.
- **Chart integration**: Pass `timeRange` and `selectedQuote` to `InteractiveChart`.

### 4. Dataviz & Aesthetic Guidelines

- **Colors**: Use `#ef4444` (red) for indices as in the original, or a professional brand color. Use emerald/red for cash flows.
- **Marks**: Thin lines for the area chart.
- **Grid**: Use the recessive grid provided by `ChartContainer`.
- **Tooltips**: Use `ChartTooltipContent` for a professional look.

## Implementation Steps

1. [ ] Define `MOCK_INDICES_DATA` and `MOCK_CASH_FLOW_DATA`.
2. [ ] Refactor `FlowBars` to be a presentational component.
3. [ ] Create `InteractiveChart` component.
4. [ ] Add state to `MarketIndices`.
5. [ ] Integrate `InteractiveChart` and `FlowBars` with state.
6. [ ] Update time range and FII/DII buttons logic and styling.
7. [ ] Final polish on layout and colors.

## Critical Files

- `src/components/MarketIndices.tsx`
- `src/components/ui/chart.tsx`

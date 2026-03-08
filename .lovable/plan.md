

## Plan: Add Multi-Select to Pricing Cards

Allow users to select multiple plans and send a combined WhatsApp message with all selected items and a total price.

### Changes to `src/components/ui/pricing.tsx`

1. **Add selection state**: `useState<Set<number>>` to track selected plan indices
2. **Make cards clickable**: Toggle selection on card click with a visual checkbox indicator and highlighted border (green glow)
3. **Show floating summary bar**: When 1+ plans are selected, show a sticky bottom bar with:
   - List of selected plan names
   - Combined total price (respects monthly/event toggle)
   - Single "Comprar por WhatsApp" button that sends a message listing all selected plans and total
4. **Keep individual buy buttons** functional as-is for single purchases

### Visual Behavior
- Clicking a card toggles a checkmark overlay and border highlight (`border-primary ring-2 ring-primary/30`)
- Bottom bar slides up with framer-motion animation
- Total price uses NumberFlow for animated transitions

### WhatsApp Message Format
When multiple plans selected, the combined message will be:
```
Hola! Quiero comprar: FOTOS ($8000) + VIDEOS ($12000). Total: $20000
```


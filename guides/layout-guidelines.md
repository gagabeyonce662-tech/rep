# Layout Guidelines

## Core Primitives

- `PageContainer`: horizontal page rhythm and max width.
- `PageSection`: section wrapper built on `PageContainer`.
- `PageHeader`: consistent eyebrow/title/description/divider structure.
- `PRODUCT_GRID_CLASS`: shared responsive grid presets for product listings.

## Rules

- Use `PageSection` for normal page content blocks.
- Use `PageHeader` for route headlines instead of repeating custom stacks.
- Use `PRODUCT_GRID_CLASS` values for product grids in routes/components.
- Keep full-bleed sections only for intentional hero/media experiences.

## Responsive Defaults

- Base padding: `px-5`
- Tablet: `md:px-8`
- Desktop: `lg:px-10`
- Small phones (<420px): use single-column product grids where appropriate.

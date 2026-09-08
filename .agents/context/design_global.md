# Design System — tur.

Global project tokens. Always follow these values ​​when generating or editing any UI element, regardless of the page or component.

## Colors

| Token                | Value     | Usage                                                                                                                    |
| -------------------- | --------- | ------------------------------------------------------------------------------------------------------------------------ |
| `--color-background` | `#F1F1F1` | General page background                                                                                                  |
| `--color-surface`    | `#FFFFFF` | Cards, modals, inputs                                                                                                    |
| `--color-primary`    | `#000000` | Text, standard buttons, icons                                                                                            |
| `--color-secondary`  | `#B85C37` | Details only (highlight icons, focus borders, badges, accents). Never use for text — low contrast against the background |
| `--color-text`       | `#000000` | Standard text                                                                                                            |
| `--color-error`      | `#DC2626` | Error/validation states                                                                                                  |
| `--color-success`    | `#000000` | Success states                                                                                                           |

```css
:root {
  --color-background: #f1f1f1;
  --color-surface: #ffffff;
  --color-primary: #000000;
  --color-secondary: #b85c37;
  --color-text: #000000;
  --color-error: #dc2626;
  --color-success: #000000;
}
```

## Typography

- **Font-family:** `Inter Tight`, sans-serif
- **Headings weight:** 600
- **Body/standard text weight:** 400

## Borders and shapes

- **Sign-up modals:** square, no `border-radius` ("card" style)
- **Inputs:** subtle `border-radius` (initial suggestion `6px`; adjust based on visual feedback)
- **Buttons:** same subtle `border-radius` as the inputs
- **Standard button:** black background (`--color-primary`), white text

## Interactions

- **Hover:** standardized for all links and buttons, featuring a minimalist style — slight variation in opacity/tone, never an abrupt transformation

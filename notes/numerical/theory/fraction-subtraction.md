# Fraction Subtraction

**Area:** numerical — theory  
**Added:** 2026-08-09

## What it means

Subtracting fractions answers: *“How much is left after I take one part away from another?”*

---

## The main trick: same-sized pieces first

Same rule as addition: fractions subtract only when the **denominator matches** — the pieces must be the same size.

### Same denominator

1. **Keep** the denominator.
2. **Subtract** the numerators (top minus top).
3. **Simplify** if possible.

**Example:** `5/8 - 2/8`

1. Denominator matches → keep `8`
2. Subtract: `5 - 2 = 3`
3. Result: **`3/8`**

**One-line rule:** *Same bottom → subtract the tops; leave the bottom alone.*

### Different denominators

1. Find the **common denominator** (LCM — see `lcm.md`).
2. **Convert** each fraction.
3. **Subtract** the numerators.
4. **Simplify**.

**Example:** `3/4 - 1/3`

1. LCM of 4 and 3 = **12**
2. `3/4 = 9/12` · `1/3 = 4/12`
3. `9/12 - 4/12 = 5/12`

**One-line rule:** *Different bottoms → make them match first, then subtract the tops.*

---

## Why it works (intuition)

Think of a **chocolate bar** split into equal pieces.

- `3/4` = **3 pieces out of 4**
- `1/3` = **1 piece out of 3** — different slice size

You cannot subtract directly. Convert both to twelfths: `9/12 - 4/12 = 5/12` — now you are taking equal-sized pieces away from equal-sized pieces.

---

## Step-by-step examples

### Example 1: `7/10 - 3/10`

1. Same denominator → keep `10`
2. Subtract: `7 - 3 = 4`
3. Result: **`2/5`** (simplify by dividing top and bottom by 2)

### Example 2: `5/6 - 1/3`

1. LCM of 6 and 3 = **6** (3 divides 6 — use the larger)
2. `1/3 = 2/6`
3. `5/6 - 2/6 = 3/6` → simplify → **`1/2`**

### Example 3: `3 1/4 - 1 3/4` (borrowing)

The fraction part of the second number is **larger** — borrow 1 from the whole:

1. `3 1/4 = 2 5/4`
2. `2 5/4 - 1 3/4 = 1 2/4`
3. Simplify: **`1 1/2`**

---

## Extra tricks

### 1. Subtracting from a whole number

Write the whole as a fraction over 1, then find a common denominator:

`1 - 1/3 = 3/3 - 1/3 = 2/3`

Or think: *one whole minus one third leaves two thirds.*

### 2. One denominator divides the other

Use the **larger** denominator as the common one — skip unnecessary multiples:

`5/6 - 1/2` → `1/2 = 3/6` → `5/6 - 3/6 = 2/6 = 1/3`

### 3. Mixed numbers without borrowing

If the top fraction is **already larger**, subtract wholes and fractions separately:

`4 3/4 - 2 1/4` → wholes: `2` · fractions: `3/4 - 1/4 = 2/4` → **`2 1/2`**

### 4. Order matters

`1/4 - 3/4 = -2/4 = -1/2` — the result can be **negative** when the second fraction is larger.

---

## Common mistakes

| Wrong | Right |
|-------|-------|
| `3/4 - 1/2 = 2/2 = 1` (subtract denominators) | `3/4 - 2/4 = 1/4` |
| `1/2 - 1/3 = 0/1 = 0` (subtract tops and bottoms) | `3/6 - 2/6 = 1/6` |
| `3 1/4 - 1 3/4 = 2 2/0` or negative fraction without borrowing | Borrow: `2 5/4 - 1 3/4 = 1 1/2` |
| Skip simplifying `2/4` | Final answer: **`1/2`** |

---

## Pocket summary

```
a/b - c/d  →  LCM → convert → (ad - bc)/bd  →  simplify
```

1. **Same denominator?** Subtract numerators only.
2. **Different?** Find **LCM**, convert, then subtract.
3. **Mixed number with borrowing?** Take 1 from the whole → add to the fraction.
4. **Simplify** the final result.

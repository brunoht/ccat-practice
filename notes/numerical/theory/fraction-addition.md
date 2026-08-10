# Fraction Addition

**Area:** numerical — theory  
**Added:** 2026-08-09

## What it means

Adding fractions answers: *“How much do I have in total when I combine these parts?”*

---

## The main trick: same-sized pieces first

Fractions add only when the **pieces are the same size** — same **denominator**.

### Same denominator

1. **Keep** the denominator.
2. **Add** the numerators.
3. **Simplify** if possible.

**Example:** `3/8 + 1/8`

1. Denominator already matches → keep `8`
2. Add numerators: `3 + 1 = 4`
3. Result: `4/8` → simplify → **`1/2`**

**One-line rule:** *Same bottom → add the tops; leave the bottom alone.*

### Different denominators

1. Find the **common denominator** (LCM — see `lcm.md`).
2. **Convert** each fraction to an equivalent with that denominator.
3. **Add** the numerators.
4. **Simplify**.

**Example:** `1/3 + 1/4`

1. LCM of 3 and 4 = **12**
2. `1/3 = 4/12` · `1/4 = 3/12`
3. `4/12 + 3/12 = 7/12`

**One-line rule:** *Different bottoms → make them match first, then add the tops.*

---

## Why it works (intuition)

Think of a **pizza** cut into equal slices.

- `1/3` = one slice from a pizza cut into **3**
- `1/4` = one slice from a pizza cut into **4**

Those slices are **different sizes** — you cannot add “1 slice + 1 slice” directly.

Fix: cut both pizzas into **12 equal slices** (common denominator). Then `1/3` = 4 small slices and `1/4` = 3 small slices → **7 slices out of 12** → `7/12`.

---

## Step-by-step examples

### Example 1: `2/5 + 1/5`

1. Same denominator → keep `5`
2. Add: `2 + 1 = 3`
3. Result: **`3/5`**

### Example 2: `1/6 + 1/4`

1. LCM of 6 and 4 = **12**
2. `1/6 = 2/12` · `1/4 = 3/12`
3. `2/12 + 3/12 = 5/12`

### Example 3: `2 1/4 + 1 2/3` (mixed numbers)

1. Convert to improper fractions: `2 1/4 = 9/4` · `1 2/3 = 5/3`
2. LCM of 4 and 3 = **12**
3. `9/4 = 27/12` · `5/3 = 20/12`
4. `27/12 + 20/12 = 47/12` → **`3 11/12`** as a mixed number

---

## Extra tricks

### 1. Simplify before adding

If a fraction can be reduced first, do it — smaller numbers, fewer errors:

`2/8 + 3/4` → `1/4 + 3/4 = 4/4 = 1`

### 2. One denominator divides the other

When one denominator is already a multiple of the other, use the **larger** one — no need to go beyond it:

`1/6 + 1/3` → common denominator = **6** (not 18)

### 3. Mixed numbers — mental shortcut

Sometimes add **whole + whole** and **fraction + fraction** separately:

`2 1/2 + 1 1/4` → wholes: `3` · fractions: `1/2 + 1/4 = 3/4` → **`3 3/4`**

Works when the fraction sum stays **less than 1**. If it reaches or passes 1, carry 1 to the whole part.

### 4. Adding three or more fractions

Find the LCM of **all** denominators, convert every fraction, then add numerators once.

`1/2 + 1/3 + 1/6` → LCM = **6** → `3/6 + 2/6 + 1/6 = 6/6 = 1`

---

## Common mistakes

| Wrong | Right |
|-------|-------|
| `1/2 + 1/3 = 2/5` (add tops and bottoms) | Match denominators: `3/6 + 2/6 = 5/6` |
| Multiply denominators when LCM is smaller (`4 × 6 = 24` instead of **12**) | Use the **least** common denominator |
| Forget to simplify `4/8` | Final answer: **`1/2`** |
| Add mixed numbers wrong: `2 1/2 + 1 1/3 = 3 2/5` | Convert or add wholes and fractions separately |

---

## Pocket summary

```
a/b + c/d  →  LCM → convert → (ad + bc)/bd  →  simplify
```

1. **Same denominator?** Add numerators only.
2. **Different?** Find **LCM**, convert, then add.
3. **Mixed number?** Convert to improper or add parts with care.
4. **Simplify** the final result.

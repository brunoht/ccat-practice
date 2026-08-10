# LCM (Least Common Multiple)

**Area:** numerical — theory  
**Added:** 2026-08-09

## What it means

The **LCM** of two or more numbers is the **smallest number that all of them divide into evenly**. For fractions, it becomes the **common denominator** when adding or subtracting.

---

## The main methods

### Method 1: list multiples (fast for small numbers)

Write multiples of each number until the **first match**.

**Example:** LCM of **4** and **6**

| 4 | 6 |
|---|---|
| 4 | 6 |
| 8 | 12 |
| **12** | **12** ← stop here |

**LCM(4, 6) = 12**

**One-line rule:** *List multiples until they meet — that meeting point is the LCM.*

### Method 2: prime factorization (reliable for any size)

1. **Factor** each number into primes.
2. Take each prime that appears, at its **highest power** in any number.
3. **Multiply** them together.

**Example:** LCM of **12** and **18**

```
12 = 2² × 3
18 = 2  × 3²
```

- Prime `2` → highest power: `2²`
- Prime `3` → highest power: `3²`

**LCM = 2² × 3² = 4 × 9 = 36**

**One-line rule:** *Highest power of each prime — multiply them all.*

### Method 3: one divides the other (shortcut)

If one number is already a **multiple** of the other, the LCM is the **larger** number.

| Pair | LCM |
|------|-----|
| 3 and 6 | **6** |
| 4 and 8 | **8** |
| 5 and 10 | **10** |

No calculation needed — use the biggest denominator.

### Method 4: formula with GCD (two numbers)

```
LCM(a, b) = (a × b) ÷ GCD(a, b)
```

**Example:** LCM of **8** and **12**

- GCD(8, 12) = 4
- LCM = `(8 × 12) ÷ 4 = 96 ÷ 4 = 24`

**One-line rule:** *Product divided by GCD gives the LCM.*

---

## Why it works (intuition)

Think of **two clocks** ticking at different intervals.

- Clock A rings every **4** minutes: 4, 8, 12, 16…
- Clock B rings every **6** minutes: 6, 12, 18…

They ring together again at **12** — the first time both intervals fit evenly. That is the LCM.

For fractions, LCM gives the **smallest slice size** that both original denominators can express — so you add or subtract without oversized numbers.

---

## Step-by-step examples

### Example 1: LCM of **4**, **6**, and **10**

1. Factor: `4 = 2²` · `6 = 2 × 3` · `10 = 2 × 5`
2. Highest powers: `2²`, `3`, `5`
3. **LCM = 4 × 3 × 5 = 60**

### Example 2: LCM of **8** and **12** (listing)

| 8 | 12 |
|---|---|
| 8 | 12 |
| 16 | 24 |
| **24** | **24** |

**LCM = 24** (same as the formula method)

### Example 3: using LCM for fractions

`1/4 + 1/6`

1. LCM(4, 6) = **12**
2. `1/4 = 3/12` · `1/6 = 2/12`
3. `3/12 + 2/12 = 5/12`

---

## Extra tricks

### Finding GCD (needed for the formula)

**List common factors:** GCD of 8 and 12 → factors 1, 2, 4 → **GCD = 4**

**Prime factors:** `8 = 2³` · `12 = 2² × 3` → shared: `2²` → **GCD = 4**

### LCM vs multiplying denominators

Multiplying denominators always works but often gives a number **larger than necessary**:

- `1/4 + 1/6` → `4 × 6 = 24` works, but LCM = **12** is smaller and faster.

Prefer LCM unless you are in a rush and the product is still manageable.

### Three or more numbers

Factor **all** numbers; include every prime at its **maximum** exponent across the set.

`LCM(2, 3, 4)` → `2² × 3 = 12`

---

## Common mistakes

| Wrong | Right |
|-------|-------|
| Use GCD instead of LCM for common denominators | GCD = greatest **divisor** · LCM = least **multiple** |
| Always multiply denominators (`4 × 6 = 24` when LCM = **12**) | Find the **least** common multiple |
| Miss a prime when factoring three numbers | Check **every** prime from **every** number |
| Pick the smaller number as LCM when one does not divide the other | LCM(4, 6) = **12**, not 4 or 6 |

---

## Pocket summary

```
LCM → smallest number all inputs divide evenly
```

1. **Small numbers** → list multiples until they match.
2. **One divides the other** → LCM = the **larger** number.
3. **General case** → prime factors, highest power of each, multiply.
4. **Two numbers** → `(a × b) ÷ GCD(a, b)`.

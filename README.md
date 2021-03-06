# stylelint-logical-properties

[![NPM Version][npm-img]][npm-url]

`stylelint-logical-properties` is a [stylelint] rule to enforce the usage of
[Logical Properties and Values] in CSS.

Physical dimensions and directions are described _left_ to _right_ and _top_ to
_bottom_, while their logical counterparts are described _start_ to _end_ and
_inline_ or _block_.

---

For example, to add spacing before the start of a paragraph, we might use the
physical `padding-left` property.

```css
p {
  padding-left: 2em;
}
```

Were the content Hebrew or Arabic — flowing _right to left_ — then we might
use alternating `padding-left` and `padding-right` properties.

```css
p:dir(ltr) {
  padding-left: 2em;
}

p:dir(rtl) {
  padding-right: 2em;
}
```

Selector weight aside, we can instead use the logical `padding-inline-start`
property.

```css
p {
  padding-inline-start: 2em;
}
```

Similarly, physical _horizontal_ and _vertical_ dimensions are described
more succinctly using their logical counterparts.

```css
h1, h2, h3 {
  margin-top: 1em;
  margin-bottom: 1em;
}

blockquote {
  margin-left: 1em;
  margin-right: 1em;
}

/* becomes */

h1, h2, h3 {
  margin-block: 1em;
}

blockquote {
  margin-inline: 1em;
}
```

## Usage

Add [stylelint] and `stylelint-logical-properties` to your project.

```bash
npm install stylelint stylelint-logical-properties --save-dev
```

Add `stylelint-logical-properties` to your [stylelint configuration].

```json5
{
  "plugins": [
    "stylelint-logical-properties"
  ],
  "rules": {
    "stylelint-logical-properties/enforce-logical-properties": ("always" || true) || ("ignore" || false || null)
  }
}
```

## Options

### always

The `"always"` option (alternatively `true`) requires logical properties and
values to be used, and the following patterns are _not_ considered violations:

```pcss
.inset {
  inset: 0;
}

.margin {
  margin-inline-start: 0;
}

.padding {
  padding-inline: 0;
}

.float {
  float: inline-start;
}

.text-align {
  text-align: start;
}

.text-align-ignored:dir(ltr) {
  text-align: left;
}
```

While the following patterns _are_ considered violations:

```pcss
.inset {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.margin {
  margin-left: 0;
}

.padding {
  padding-left: 0;
  padding-right: 0;
}

.float {
  float: left;
}

.text-align {
  text-align: left;
}
```

### ignore

The `"ignore"` option (alternatively `false` or `null`) disables the rule.

## Secondary Options

### except

The `except` option ignores reporting or autofixing properties and values
matching a case-insensitive string or regular expression.

```json5
{
  "rules": {
    "stylelint-logical-properties/enforce-logical-properties": ["always", { "except": ['float', "/^margin/i"] }]
  }
}
```

### direction

The `direction` option controls whether _left to right_ or _right to left_
properties and values should be reported or autofixed.

```json
{
  "rules": {
    "liberty/use-logical-spec": ["always", { "direction": "ltr" || "rtl" }]
  }
}
```

## Property and Value Mapping

Assuming _left to right_ directionality:

# Positioning

| Physical Property | Logical Property       |
| ----------------- | ---------------------- |
| `top`             | `inset-block-start`    |
| `right`           | `inset-inline-end`     |
| `bottom`          | `inset-block-end`      |
| `left`            | `inset-inline-start`   |

### margin

| Physical Property | Logical Property       |
| ----------------- | ---------------------- |
| `margin-top`      | `margin-block-start`   |
| `margin-right`    | `margin-inline-end`    |
| `margin-bottom`   | `margin-block-end`     |
| `margin-left`     | `margin-inline-start`  |

### Padding

| Physical Property | Logical Property       |
| ----------------- | ---------------------- |
| `padding-top`     | `padding-block-start`  |
| `padding-right`   | `padding-inline-end`   |
| `padding-bottom`  | `padding-block-end`    |
| `padding-left`    | `padding-inline-start` |

### Logical Height and Logical Width

| Physical Property | Logical Property       |
| ----------------- | ---------------------- |
| `height`          | `block-size`           |
| `min-height`      | `min-block-size`       |
| `max-height`      | `max-block-size`       |
| `width`           | `inline-size`          |
| `min-width`       | `min-inline-size`      |
| `max-width`       | `max-inline-size`      |

### Border

| Physical Property            | Logical Property            |
| ---------------------------- | --------------------------- |
| `border-top`                 | `border-block-start`        |
| `border-top-color`           | `border-block-start-color`  |
| `border-top-style`           | `border-block-start-style`  |
| `border-top-width`           | `border-block-start-width`  |
| `border-bottom`              | `border-block-end`          |
| `border-bottom-color`        | `border-block-end-color`    |
| `border-bottom-style`        | `border-block-end-style`    |
| `border-bottom-width`        | `border-block-end-width`    |
| `border-left`                | `border-inline-start`       |
| `border-left-color`          | `border-inline-start-color` |
| `border-left-style`          | `border-inline-start-style` |
| `border-left-width`          | `border-inline-start-width` |
| `border-right`               | `border-inline-end`         |
| `border-right-color`         | `border-inline-end-color`   |
| `border-right-style`         | `border-inline-end-style`   |
| `border-right-width`         | `border-inline-end-width`   |
| `border-top-left-radius`     | `border-start-start-radius` |
| `border-bottom-left-radius`  | `border-start-end-radius`   |
| `border-top-right-radius`    | `border-end-start-radius`   |
| `border-bottom-right-radius` | `border-end-end-radius`     |


border-start-start-radius	border-top-left-radius
border-start-end-radius	border-bottom-left-radius
border-end-start-radius	border-top-right-radius
border-end-end-radius	border-bottom-right-radius

## Credits
Forked from https://github.com/Jordan-Hall/stylelint-use-logical-spec

[npm-img]: https://img.shields.io/npm/v/stylelint-logical-properties.svg
[npm-url]: https://www.npmjs.com/package/stylelint-logical-properties

[Logical Properties and Values]: https://www.w3.org/TR/css-logical-1/
[stylelint]: https://github.com/stylelint/stylelint
[stylelint configuration]: https://github.com/stylelint/stylelint/blob/master/docs/user-guide/configuration.md#readme

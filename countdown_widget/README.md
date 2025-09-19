
#  Countdown Widget Module Summary

##  Overview

**Countdown Widget** is a **custom countdown widget** that can be used with any `datetime` or `date` field in **Odoo 18**.
It provides a beautiful and responsive countdown display with **advanced controls for size, alignment, and warning thresholds**.

---

##  Main Features

###  Core Features

* Countdown display (days, hours, minutes, seconds).
* Auto update every second.
* Supports Arabic and English languages.
* Responsive design with dark mode.
* Beautiful visual and animated effects.
* Visual warning when the deadline is approaching.
* Shows **"Time is up"** message when the deadline expires.

### 🎨 Advanced Control Features

* **Size:** `small`, `large`.
* **Alignment:** `left`, `center`, `right`.
* **Compact Mode:** save space with option to show/hide labels.
* **Warning Threshold:** fixed value (days/hours) or dynamic field.

---

## 🛠 Usage

###  Basic Usage

```xml
<field name="deadline" widget="countdown"/>
```

###  Usage with Custom Options

```xml
<!-- Small size with left alignment -->
<field name="deadline" widget="countdown"
       options="{'size': 'small', 'alignment': 'left'}"/>

<!-- Compact mode without labels -->
<field name="deadline" widget="countdown"
       options="{'compact': true, 'show_labels': false, 'alignment': 'center'}"/>

<!-- Warning after 12 hours -->
<field name="deadline" widget="countdown"
       options="{'warning': 0.5, 'alignment': 'center'}"/>
```

---

## ️ Available Properties

| Property      | Values                    | Description                     |
| ------------- | ------------------------- | ------------------------------- |
| `size`        | `small`, `large`          | Widget size                     |
| `alignment`   | `left`, `center`, `right` | Alignment inside the form       |
| `compact`     | `true`, `false`           | Enable compact mode             |
| `show_labels` | `true`, `false`           | Show or hide labels             |
| `warning`     | Number or field name      | Warning threshold in days/hours |

---

##  Requirements

* Odoo **18.0+**
* Python **3.8+**
* Modern browser (Chrome, Firefox, Safari, Edge)

---

##  Future Development

* Add sound alerts.
* Support system notifications.
* More languages.
* Improve mobile compatibility.


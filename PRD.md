# 📄 Product Requirements Document (PRD)

## 🏋️ Product Name

**Athlete Habit Tracker (Mobile-First Web App)**

---

# 1. 📌 Overview

The Athlete Habit Tracker is a **mobile-first web application** designed for a single athlete (your friend) to:

* Track daily habits (Workout, Diet, Recovery)
* Maintain consistency using streaks
* Monitor progress via a simple dashboard
* Achieve goals linked to specific habits

The product focuses on:

* Simplicity
* Daily usability
* Fast interaction (1–2 taps per action)

---

# 2. 🎯 Objectives

### Primary Goals:

* Improve daily discipline
* Maintain habit consistency
* Provide clear visual progress

### Success Criteria:

* User logs habits daily
* Streaks increase over time
* Goals are actively tracked and completed

---

# 3. 👤 Target User

* Single user (your friend)
* Athlete / fitness-focused individual
* Uses primarily on **mobile browser**

---

# 4. ⚙️ Features & Functional Requirements

---

## 4.1 🔐 Authentication

### Description:

Secure user access.

### Functional Requirements:

* User signup (email + password)
* User login/logout
* Session handling (Supabase Auth)

---

## 4.2 🟢 Habit Management

### Description:

User creates and manages daily habits.

### Habit Fields:

* Name (e.g., “Morning Run”)
* Type:

  * Workout
  * Diet
  * Recovery
* Created_at

### Functional Requirements:

* Create habit
* Edit habit
* Delete habit
* Multiple habits allowed (even same type)
* All habits repeat **daily (fixed)**

---

## 4.3 ✅ Daily Habit Tracking

### Description:

Track completion of habits per day.

### Functional Requirements:

* Display **today’s habits**
* Mark habit as:

  * Completed
  * Not completed

### Rules:

* Only **one log per habit per day**
* User can update same day entry

---

## 4.4 🔥 Streak System (Per Habit)

### Description:

Tracks consistency per habit.

### Stored Fields:

* current_streak
* last_completed_date

### Logic:

* If completed today AND yesterday → streak +1
* If completed today BUT missed yesterday → streak = 1
* If missed today → streak = 0

### Example:

| Day | Status | Streak |
| --- | ------ | ------ |
| 1   | ✅      | 1      |
| 2   | ✅      | 2      |
| 3   | ❌      | 0      |
| 4   | ✅      | 1      |

---

## 4.5 📊 Dashboard (Mobile Optimized)

### Description:

Shows performance summary.

### Components:

#### Top Section:

* Total habits today
* Completed habits count
* Completion %

#### Middle Section:

* Today’s habits (main UI)

#### Bottom Section:

* 7-day activity chart

---

## 4.6 🎯 Goal Management (Linked to Habit)

### Description:

Track progress toward specific targets.

### Fields:

* Title
* habit_id (linked)
* target_count (e.g., 20)
* start_date
* end_date

### Logic:

* Count completed logs for that habit within date range
* Show progress:

  * Example: 12 / 20 completed

---

## 4.7 📅 Daily Summary

### Description:

Simple daily feedback.

### Example:

* “You completed 3/5 habits today”

---

## 4.8 ❌ Missed Habit Indicator

### Description:

Highlight incomplete habits.

### Behavior:

* Unchecked habits visually distinct (e.g., red/grey)
* Helps identify missed routines

---

## 4.9 ↩️ Undo Action (Optional but Recommended)

### Description:

Allow user to reverse accidental completion.

---

# 5. 🧠 Non-Functional Requirements

* 📱 Mobile-first responsive design
* ⚡ Fast loading (<2 seconds)
* 🧼 Clean UI (minimal inputs)
* 🔒 Secure authentication
* 🌐 Online-only (no offline sync)

---

# 6. 🗄️ Database Schema (Final)

---

### users

```sql id="1vjlwm"
id (PK)
email
created_at
```

---

### habits

```sql id="j21d22"
id (PK)
user_id (FK)
name
type
current_streak
last_completed_date
created_at
```

---

### habit_logs

```sql id="w1g0lw"
id (PK)
habit_id (FK)
date
completed (boolean)
duration (optional)
notes (optional)

UNIQUE(habit_id, date)
```

---

### goals

```sql id="q7o45i"
id (PK)
user_id (FK)
habit_id (FK)
title
target_count
start_date
end_date
```

---

# 7. ⚙️ Core Backend Logic

---

## Mark Habit Complete

```js id="ssw6e3"
if (last_completed_date == yesterday) {
    current_streak += 1
} else {
    current_streak = 1
}

last_completed_date = today
insert into habit_logs
```

---

## Prevent Duplicate Logs

```sql id="spq1ba"
UNIQUE(habit_id, date)
```

---

# 8. 🖥️ UI Structure (Mobile-First)

---

## 🏠 Home (Dashboard)

* Summary (top)
* Today’s habits (main)
* Progress chart (bottom)

---

## 📋 Habits Page

* List of habits
* Add / edit / delete

---

## 🎯 Goals Page

* Goals list
* Progress bars

---

# 9. 🔄 User Flow

1. User signs up / logs in
2. Creates habits
3. Opens app daily
4. Marks habits complete
5. Tracks streaks & goals

---

# 10. 🚫 Out of Scope

* Notifications
* AI coaching
* Social sharing
* Wearable integrations
* Payments / monetization

---

# 11. ⚡ MVP Development Plan

Build in this order:

1. Authentication (Supabase)
2. Habit CRUD
3. Daily tracking
4. Streak logic
5. Dashboard
6. Goals

---

# 12. ⚠️ Key Constraints

* Single-user focused experience
* Must be usable with one hand (mobile UX)
* Actions should require minimal taps

---

# Data Cleaning & Entry Automation Tool

A Python (pandas) pipeline that takes a messy, real-world-style customer
dataset and produces a clean, standardized, validated dataset ready for
entry into a system of record — plus a summary report of everything fixed.

## Why I built this

Preparing for a data entry role, I wanted to demonstrate the core skill the
job actually requires: turning inconsistent, error-prone raw data into
clean, trustworthy records — accurately and at volume. This project
simulates common real-world data entry problems and fixes them
systematically instead of manually.

## Problems in the raw data

- Dates in 5 different formats mixed together (`26-04-2025`, `2025.11.29`, `05 Aug 2026`, etc.)
- Country names with 15 inconsistent spellings (`EGYPT`, `egypt`, `EG`, `U.S.A.`, `usa`...)
- Phone numbers in inconsistent formats (dashes, spaces, parentheses, padding)
- Broken/invalid email addresses (typos, `@@`, `" at "` instead of `@`)
- Duplicate customer records, including near-duplicates hidden by different email casing
- Missing values in required fields (phone, purchase amount)

## What the pipeline does

1. **Standardizes dates** to `YYYY-MM-DD` by matching against known raw formats
2. **Standardizes country names** to one canonical value per country
3. **Cleans names and phone numbers** (whitespace, casing, digits-only)
4. **Validates emails** against a format pattern and flags invalid ones
5. **Detects and removes duplicate customers**, including casing-based near-duplicates
6. **Flags rows needing manual review** (rather than silently deleting them) —
   invalid email, missing phone, missing purchase amount, or unparseable date

## Results

| Metric | Value |
|---|---|
| Raw rows loaded | 248 |
| Duplicate rows removed | 28 |
| Final unique rows | 220 |
| Dates standardized | 248 / 248 (0 failures) |
| Country name variants collapsed | 15 → 4 |
| Invalid emails flagged | 24 |
| Rows flagged for manual review in final output | 38 |

## Tech used

Python, pandas, regex — built and run in Google Colab.

## Files

- `raw_customers.csv` — the original messy dataset
- `clean_customers.csv` — the cleaned, standardized output
- `cleaning_report.txt` — summary of what was fixed
- `data_cleaning_notebook.ipynb` — full annotated pipeline, step by step

## How to run

Open `data_cleaning_notebook.ipynb` in Google Colab, upload `raw_customers.csv`
to the session, and run all cells top to bottom.

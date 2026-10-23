# End-to-End Sales Data Pipeline

## Project Overview
This project is an automated data pipeline that captures sales transactions from a custom web form, stages them in Google Sheets, loads them into a Google BigQuery data warehouse, and visualizes the metrics in a Looker Studio dashboard.

**The Business Problem:** Manual data entry and flat-file exports often lead to data silos, inconsistent formatting, and delayed reporting. This pipeline solves that by providing a controlled front-end interface that guarantees structured data flows directly into a live BI dashboard.

## Architecture
```text
[Custom HTML Form]
       | (POST)
       v
[Google Apps Script API]
       | (Writes row with 'synced = FALSE')
       v
[Google Sheets (Staging)]
       | (Daily Trigger / Batch Load)
       v
[BigQuery (Data Warehouse)]
       | (Native Connector)
       v
[Looker Studio Dashboard]
```

## Tech Stack

* **Frontend:** HTML, CSS, JavaScript (Fetch API)
* **Backend / Orchestration:** Google Apps Script (Web App & Time-driven Triggers)
* **Staging:** Google Sheets
* **Data Warehouse:** Google BigQuery
* **BI & Visualization:** Looker Studio

## Key Features

* **Data Validation:** The frontend auto-fills the `category` field based on the selected product to prevent human error.
* **Automated Derived Fields:** The backend automatically generates unique `order_id`s, calculates `total_amount`, and timestamps all entries.
* **Idempotent Data Syncing:** The pipeline uses a `synced` boolean column to ensure rows are only pushed to BigQuery once, preventing duplicates.
* **Data Sanitization:** The Apps Script includes logic to trim invisible spaces from strings before generating the CSV batch load, preventing schema mismatches in BigQuery.

## Dashboard

![Dashboard Preview](https://raw.githubusercontent.com/ahmadabuz/end-to-end-sales-pipeline/main/dashboard.jpg)

View the live interactive dashboard here: [Looker Studio Link](https://datastudio.google.com/s/pTD0_5gGO50)

## Repository Structure

```text
sales-data-pipeline/
├── index.html
├── appsscript.js
├── dashboard.png
└── README.md
```

## How to Reproduce

1. Create a Google Sheet with the required headers (`timestamp`, `order_id`, `order_date`, `customer_id`, `product_name`, `category`, `quantity`, `unit_price`, `total_amount`, `region`, `sales_rep`, `payment_method`, `synced`).
2. Deploy the `appsscript.js` as a Web App and link the `index.html` form to the Web App URL.
3. Create a BigQuery Dataset and Table with the corresponding schema.
4. Add the `syncToBigQuery` function to Apps Script and set up a time-driven trigger to run daily.
5. Connect Looker Studio to the BigQuery table.

## Source Code

<details>
<summary><b>Frontend: index.html</b></summary>

```html
<!-- PASTE YOUR FULL INDEX.HTML CODE HERE -->
```

</details>

<details>
<summary><b>Backend: appsscript.js</b></summary>

```javascript
// PASTE YOUR FULL APPS SCRIPT CODE HERE
```

</details>

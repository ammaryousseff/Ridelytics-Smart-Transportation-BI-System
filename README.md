<div align="center">

<div>
  <img src="Logo & Theme\ridelytics logo resized.png" alt="Ridelytics" width="200" style="filter: brightness(0) invert(1);" />
</div>

<br/>

<sub>ITI POWER BI DEVELOPMENT · GRADUATION PROJECT</sub>

# **Ridelytics Smart Transportation BI System**

**End-to-End BI + Automation + Web Portal**


<a href="Documentations/Ridelytics%20Initial%20Documentation.pdf">📄 Documentation (Initial)</a>
&nbsp;·&nbsp;
<a href="Documentations/Ridelytics%20Full%20Project%20Documentation.docx.pdf">📋 Documentation (Full)</a>
&nbsp;·&nbsp;
<a href="Website/README.md">🌐 Website Setup</a>


<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&pause=900&center=true&vCenter=true&width=900&lines=OLTP+%E2%86%92+SSIS+ETL+%E2%86%92+DWH+%E2%86%92+SSAS+%E2%86%92+SSRS+%26+Power+BI;Admin+Portal+%2B+Dashboard+KPIs+%2B+AI+Chat+via+n8n;ITI+Power+BI+Development+Graduation+Project" alt="typing" />

<br/>

<img alt="SQL Server" src="https://img.shields.io/badge/SQL%20Server-2025-cc2927?style=for-the-badge" />
<img alt="Azure" src="https://img.shields.io/badge/Azure-Cloud-0078D4?style=for-the-badge" />
<img alt="SSIS" src="https://img.shields.io/badge/SSIS-ETL-1f6feb?style=for-the-badge" />
<img alt="SSAS" src="https://img.shields.io/badge/SSAS-Cube-8957e5?style=for-the-badge" />
<img alt="SSRS" src="https://img.shields.io/badge/SSRS-Reports-444?style=for-the-badge" />
<img alt="Power BI" src="https://img.shields.io/badge/Power%20BI-Dashboards-f2c811?style=for-the-badge" />
<img alt="n8n" src="https://img.shields.io/badge/n8n-Workflows-ff6d00?style=for-the-badge" />
<img alt="Python" src="https://img.shields.io/badge/Python-Data%20Generation-3776AB?style=for-the-badge" />
<img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-000000?style=for-the-badge" />
<img alt="Express" src="https://img.shields.io/badge/Express-API-3c873a?style=for-the-badge" />

</div>

---

## 📖 Project Overview

Ridelytics is a full-stack transportation BI solution that starts from an OLTP database and ends with analytics consumption (SSAS cube, SSRS reports, Power BI dashboards), plus operational automation (n8n) and a modern web portal for admin users.

**What you get in this repository**

| | Deliverable | Description |
|---|---|---|
| 🗄️ | **Database Schema + Stored Procedures** | SQL scripts to create the transactional model and stored procedures |
| 🐍 | **Data Generation** | Python generator + SQL insert script for realistic sample data |
| 🏗️ | **DWH & Galaxy Schema** | Warehouse design diagrams and a backup |
| 🔄 | **ETL (SSIS)** | Packages to load dimensions/facts and orchestrate the pipeline |
| 🧊 | **Cube (SSAS)** | Dimensions and cube project assets |
| 📊 | **Consumption** | SSRS reports + Power BI dashboard screenshots |
| ⚡ | **Automation (n8n)** | Workflows for daily reporting, complaint auto-classification, and NLQ (Arabic & English) |
| 🌐 | **Website** | Next.js frontend + Express backend (dashboard, CRUD for entities, AI chat via webhook) |

---

## 🛠️ Tools & Tech Stack

| Area | Tools |
|------|-------|
| OLTP | SQL Server 2025 + Stored Procedures |
| Data Generation | Python + Pandas |
| ETL | SSIS (Dimensions with SCD + Facts with Lookups) |
| DWH Modeling | Galaxy schema |
| Cube | SSAS |
| Reporting | SSRS |
| Dashboards | Power BI |
| Automation | n8n workflows (email + AI/NLQ) |
| Web Portal | Next.js 15 + React 19 + Tailwind + Express + mssql |

---

## 🏗️ End-to-End Pipeline

```
OLTP  ──►  Data Gen  ──►  SSIS ETL  ──►  DWH (Galaxy)  ──►  SSAS Cube  ──►  Power BI / SSRS
           (Python)        (SCD +          (Star/Fact                         (21 Dashboards
                           Lookups)         Tables)                            + Reports)
                                                                    │
                                                                    ▼
                                                         n8n Automation + Web Portal
```

---

## 🎬 Demo (Power BI)

<p align="center">
  <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Navigation%20Hub.jpg" alt="Power BI Navigation Hub" width="900" />
</p>

---

## 🗺️ Key Diagrams & Screenshots

### 1 · Database ERD
<p align="center">
  <img src="ERD/Ridelytics%20ERD.png" alt="Database ERD" width="900" />
</p>

### 2 · Mapping
<p align="center">
  <img src="Mapping/Ridelytics%20Mapping.png" alt="Ridelytics Mapping" width="900" />
</p>

### 3 · Creating Server on Azure
<p align="center">
  <img src="Database%20Schema/Database%20Server%20On%20Azure.png" alt="Database Server on Azure" width="900" />
</p>

### 4 · Database Diagram
<p align="center">
  <img src="Database%20Schema/Database%20Diagram.png" alt="Database Diagram" width="900" />
</p>

### 5 · DWH Modelling (Galaxy Schema)
<p align="center">
  <img src="Data%20Warhouse/RidelyticsDWH_Galaxy_Schema.png" alt="DWH Galaxy Schema" width="900" />
</p>

### 6 · DWH Diagram
<p align="center">
  <img src="Data%20Warhouse/DWH%20Diagram.png" alt="DWH Diagram" width="900" />
</p>

---

### 7 · SSIS (ETL Pipeline)

**Highlights**

<p align="center">
  <img src="SSIS/Screenshots/Load%20Dim%20Driver%20with%20SCD.png" alt="Load Dim Driver with SCD" width="900" />
</p>

<p align="center">
  <img src="SSIS/Screenshots/Load%20Fact%20Trip.png" alt="Load Fact Trip" width="900" />
</p>

<details>
  <summary>📂 Show all SSIS (ETL) screenshots</summary>
  <br/>

  <p align="center">
    <img src="SSIS/Screenshots/Load%20Dim%20Zone%20With%20SCD.png" alt="Load Dim Zone with SCD" width="900" />
  </p>
  <p align="center">
    <img src="SSIS/Screenshots/Load%20Dim%20Rider%20With%20SCD.png" alt="Load Dim Rider with SCD" width="900" />
  </p>
  <p align="center">
    <img src="SSIS/Screenshots/Load%20Dim%20Payment%20With%20SCD.png" alt="Load Dim Payment with SCD" width="900" />
  </p>
  <p align="center">
    <img src="SSIS/Screenshots/Load%20Dim%20Promotion%20With%20SCD.png" alt="Load Dim Promotion with SCD" width="900" />
  </p>
  <p align="center">
    <img src="SSIS/Screenshots/Load%20Dim%20SeasonalPattern%20With%20SCD.png" alt="Load Dim SeasonalPattern with SCD" width="900" />
  </p>
  <p align="center">
    <img src="SSIS/Screenshots/Load%20Dim%20SurgeRule%20With%20SCD.png" alt="Load Dim SurgeRule with SCD" width="900" />
  </p>
  <p align="center">
    <img src="SSIS/Screenshots/Load%20Fact%20DriverEarnings.png" alt="Load Fact Driver Earnings" width="900" />
  </p>
  <p align="center">
    <img src="SSIS/Screenshots/Load%20Fact%20Complaint.png" alt="Load Fact Complaint" width="900" />
  </p>
  <p align="center">
    <img src="SSIS/Screenshots/Load%20Fact%20Rating.png" alt="Load Fact Rating" width="900" />
  </p>
</details>

---

### 8 · SSAS (Cubes)
<p align="center">
  <img src="SSAS/SSAS%20Cube.jpg" alt="SSAS Cube" width="900" />
</p>

---

### 9 · SSRS (Reports)

<p align="center">
  <img src="SSRS/Driver%20Performance%20Report.png" alt="SSRS Driver Performance Report" width="900" />
</p>
<p align="center">
  <img src="SSRS/Financial%20Report.png" alt="SSRS Financial Report" width="900" />
</p>
<p align="center">
  <img src="SSRS/Operations%20Summary%20Report.png" alt="SSRS Operations Summary Report" width="900" />
</p>
<p align="center">
  <img src="SSRS/Promotions%20Report.png" alt="SSRS Promotions Report" width="900" />
</p>
<p align="center">
  <img src="SSRS/Riders%20List%20Report.png" alt="SSRS Riders List Report" width="900" />
</p>
<p align="center">
  <img src="SSRS/Trip%20Details%20Report.png" alt="SSRS Trip Details Report" width="900" />
</p>

---

### 10 · Power BI Dashboards

**Featured**

<p align="center">
  <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20135357.png" alt="Executive Overview" width="900" />
</p>
<p align="center">
  <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20135814.png" alt="Pickup Experience" width="900" />
</p>
<p align="center">
  <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20135910.png" alt="Revenue & Profit" width="900" />
</p>
<p align="center">
  <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20140256.png" alt="Complaints & Quality" width="900" />
</p>
<p align="center">
  <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20140452.png" alt="Trip Flow Map" width="900" />
</p>

<details>
  <summary>📊 Show all Power BI dashboard screenshots</summary>
  <br/>

  <p align="center">
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Navigation%20Hub.jpg" alt="Power BI Navigation Hub" width="900" />
  </p>

  <p>
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20135357.png" width="280" />
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20135518.png" width="280" />
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20135552.png" width="280" />
  </p>
  <p>
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20135628.png" width="280" />
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20135654.png" width="280" />
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20135745.png" width="280" />
  </p>
  <p>
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20135814.png" width="280" />
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20135846.png" width="280" />
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20135910.png" width="280" />
  </p>
  <p>
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20140001.png" width="280" />
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20140035.png" width="280" />
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20140116.png" width="280" />
  </p>
  <p>
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20140147.png" width="280" />
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20140214.png" width="280" />
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20140235.png" width="280" />
  </p>
  <p>
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20140256.png" width="280" />
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20140329.png" width="280" />
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20140403.png" width="280" />
  </p>
  <p>
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20140430.png" width="280" />
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20140452.png" width="280" />
    <img src="Power%20BI%20Dashboards/Dashboards%20Screeshots/Screenshot%202026-05-18%20140518.png" width="280" />
  </p>
</details>

---

### 11 · Workflows (n8n)

#### ⚡ Workflow 1 — Rider Churn Re-Engagement
<p align="center">
  <img src="N8N%20Workflows/Screenshots/Workflow%201.png" alt="Rider Churn Re-Engagement Workflow" width="900" />
</p>
<p align="center">
  <img src="N8N%20Workflows/Screenshots/Email%201.png" alt="Rider Churn Re-Engagement Email Example" width="900" />
</p>

#### ⚡ Workflow 2 — Complaint Auto-Classification
<p align="center">
  <img src="N8N%20Workflows/Screenshots/Workflow%202.png" alt="Complaint Auto-Classification Workflow" width="900" />
</p>
<p align="center">
  <img src="N8N%20Workflows/Screenshots/Email%202.png" alt="Complaint Workflow Email Example" width="900" />
</p>

#### ⚡ Workflow 3 — Daily BI Insight Narrator
<p align="center">
  <img src="N8N%20Workflows/Screenshots/Workflow%203.png" alt="Daily BI Insight Narrator Workflow" width="900" />
</p>
<p align="center">
  <img src="N8N%20Workflows/Screenshots/Email%203.png" alt="Daily BI Insight Narrator Email Example" width="900" />
</p>

#### ⚡ Workflow 4 — Natural Language Query Interface (Arabic & English)
<p align="center">
  <img src="N8N%20Workflows/Screenshots/Workflow%204.png" alt="NLQ Workflow" width="900" />
</p>
<p align="center">
  <img src="N8N%20Workflows/Screenshots/AI%20Assistant%201.png" alt="AI Assistant Example" width="900" />
</p>

---

### 12 · Website

<p align="center">
  <img src="Website/Website%20Screenshots/Landing%20Page.gif" alt="Website Landing (GIF)" width="900" />
</p>
<p align="center">
  <img src="Website/Website%20Screenshots/Screenshot%202026-05-18%20003057.png" alt="Website Screenshot 2" width="900" />
</p>
<p align="center">
  <img src="Website/Website%20Screenshots/Screenshot%202026-05-18%20003106.png" alt="Website Screenshot 3" width="900" />
</p>
<p align="center">
  <img src="Website/Website%20Screenshots/Screenshot%202026-05-18%20003128.png" alt="Website Screenshot 5" width="900" />
</p>
<p align="center">
  <img src="Website/Website%20Screenshots/Screenshot%202026-05-18%20003146.png" alt="Website Screenshot 6" width="900" />
</p>
<p align="center">
  <img src="Website/Website%20Screenshots/Screenshot%202026-05-18%20004311.png" alt="Website Screenshot 7" width="900" />
</p>
<p align="center">
  <img src="Website/Website%20Screenshots/Screenshot%202026-05-18%20004436.png" alt="Website Screenshot 9" width="900" />
</p>
<p align="center">
  <img src="Website/Website%20Screenshots/Screenshot%202026-05-18%20004504.png" alt="Website Screenshot 10" width="900" />
</p>
<p align="center">
  <img src="Website/Website%20Screenshots/Screenshot%202026-05-18%20004520.png" alt="Website Screenshot 11" width="900" />
</p>

---

## 👥 Meet the Team

<div align="center">

<sub>MEET THE TEAM</sub>

## 🚀 The BI Strike Team 🚀

<table>
  <tr>
    <td align="center" width="160">
      <img src="https://ui-avatars.com/api/?name=Ammar+Youssef&background=534AB7&color=fff&size=64&bold=true&rounded=true" width="52" height="52" style="border-radius:50%"/><br/>
      <b>Ammar Youssef</b><br/>
      <sub>BI Dev &amp; Data Analyst</sub><br/><br/>
      <a href="https://github.com/ammaryousseff"><img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white"/></a>
      <a href="https://www.linkedin.com/in/ammaryoussef/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white"/></a>
    </td>
    <td align="center" width="160">
      <img src="https://ui-avatars.com/api/?name=Ibrahim+Kamal&background=0F6E56&color=fff&size=64&bold=true&rounded=true" width="52" height="52" style="border-radius:50%"/><br/>
      <b>Ibrahim Kamal</b><br/>
      <sub>BI Dev &amp; Data Analyst</sub><br/><br/>
      <a href="https://github.com/ibrahimahmed1029"><img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white"/></a>
      <a href="https://www.linkedin.com/in/ibrahim-ahmed-kamal/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white"/></a>
    </td>
    <td align="center" width="160">
      <img src="https://ui-avatars.com/api/?name=Manar+Hossam&background=993C1D&color=fff&size=64&bold=true&rounded=true" width="52" height="52" style="border-radius:50%"/><br/>
      <b>Manar Hossam</b><br/>
      <sub>BI Dev &amp; Data Analyst</sub><br/><br/>
      <a href="https://github.com/ManarHossamMohamed"><img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white"/></a>
      <a href="https://www.linkedin.com/in/manarhossam2/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white"/></a>
    </td>
    <td align="center" width="160">
      <img src="https://ui-avatars.com/api/?name=Salma+ElTahhan&background=993556&color=fff&size=64&bold=true&rounded=true" width="52" height="52" style="border-radius:50%"/><br/>
      <b>Salma ElTahhan</b><br/>
      <sub>BI Dev &amp; Data Analyst</sub><br/><br/>
      <a href="https://github.com/SalmaElTahhan"><img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white"/></a>
      <a href="https://www.linkedin.com/in/salma-eltahhan/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white"/></a>
    </td>
    <td align="center" width="160">
      <img src="https://ui-avatars.com/api/?name=Tasneem+Elagamy&background=185FA5&color=fff&size=64&bold=true&rounded=true" width="52" height="52" style="border-radius:50%"/><br/>
      <b>Tasneem Elagamy</b><br/>
      <sub>BI Dev &amp; Data Analyst</sub><br/><br/>
      <a href="https://github.com/tasnimelagamy"><img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white"/></a>
      <a href="https://www.linkedin.com/in/tasnimelagamy/"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white"/></a>
    </td>
  </tr>
</table>

</div>

---

## 🙏 Thank you for visiting

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&pause=900&center=true&vCenter=true&width=900&lines=Thanks+for+visiting+Ridelytics;Fork+%E2%80%A2+Star+%E2%80%A2+Contribute+%E2%80%94+we%E2%80%99d+love+your+feedback" alt="Thanks" />
</p>
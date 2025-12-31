# Missing Department Users Analysis

**Date:** December 2025  
**Purpose:** Identify departments that exist in old CMDMS but don't have test users in new CMDMS

---

## 📊 Department Status Summary

**Total Departments in System:** 49  
**Departments with Users:** 20  
**Departments Missing Users:** 29

---

## ✅ Departments WITH Users (20)

| ID | Department Name | User Email | User Name |
|----|----------------|------------|-----------|
| 2 | Agriculture | mushtaq.ahmad@agriculture.gov.pk | Mushtaq Ahmad |
| 2 | Agriculture | nadia.kamal@agriculture.gov.pk | Nadia Kamal |
| 3 | C & W | tariq.aziz@cw.gov.pk | Engr. Tariq Aziz |
| 5 | Energy & Power | bilal.ahmed@energy.gov.pk | Engr. Bilal Ahmed |
| 7 | E & SE | rashid.mahmood@education.gov.pk | Rashid Mahmood |
| 7 | E & SE | sadia.iqbal@education.gov.pk | Sadia Iqbal |
| 8 | Information & Public Relations | junaid.malik@info.gov.pk | Junaid Malik |
| 10 | Forest, Environment and Wildlife | ghulam.abbas@forest.gov.pk | Ghulam Abbas |
| 14 | Finance | saqib.zaman@finance.gov.pk | Saqib Zaman |
| 14 | Finance | uzma.khalid@finance.gov.pk | Uzma Khalid |
| 16 | Health | ahmed.hassan@health.gov.pk | Dr. Ahmed Hassan |
| 16 | Health | fatima.noor@health.gov.pk | Dr. Fatima Noor |
| 18 | Irrigation | hamza.yousaf@irrigation.gov.pk | Hamza Yousaf |
| 20 | Higher Education | imran.shah@higher-edu.gov.pk | Prof. Imran Shah |
| 21 | Home & Tribal Affairs | zahid.hussain@home.gov.pk | Zahid Hussain |
| 22 | Housing | muhammad.asif@housing.gov.pk | Muhammad Asif |
| 25 | LG & RDD | naeem.khan@lgrdd.gov.pk | Naeem Khan |
| 27 | Planning & Development | khalid.pervaiz@planning.gov.pk | Khalid Pervaiz |
| 30 | Revenue | asad.ullah@revenue.gov.pk | Asad Ullah |
| 31 | Social Welfare | rukhsana.bibi@socialwelfare.gov.pk | Rukhsana Bibi |
| 32 | Transport | faisal.karim@transport.gov.pk | Faisal Karim |
| 42 | Police Department | shahid.afridi@police.gov.pk | SSP Shahid Afridi |
| 44 | Admin | admin@cmdms.gov.pk | Admin User |
| 45 | Data Entry | data.entry1@cmdms.gov.pk | Data Entry User 1 |
| 45 | Data Entry | data.entry2@cmdms.gov.pk | Data Entry User 2 |

---

## ❌ Departments MISSING Users (29)

### Main Departments (Type 1) - Missing Users (17)

| ID | Department Name | Priority | Notes |
|----|----------------|----------|-------|
| 1 | Administration | Low | Usually admin-only |
| 4 | Auqaf | Medium | Religious Endowments |
| 6 | Law | Medium | Legal department |
| 9 | ST & IT | High | Science & Technology & IT |
| 11 | Relief Rehabilitation & Settlement | Medium | Important for disaster management |
| 12 | Establishment | Low | HR/Admin functions |
| 13 | Excise & Taxation | Medium | Revenue collection |
| 15 | Food | Medium | Food security |
| 17 | Industries | Medium | Industrial development |
| 19 | Labour | Medium | Labor affairs |
| 23 | IPC | Low | Integrated Population Census |
| 24 | Zakat & Ushr | Medium | Religious tax collection |
| 26 | Minerals Development | Medium | Mining sector |
| 28 | Population Welfare | Medium | Population control |
| 29 | PHE | Medium | Public Health Engineering |
| 33 | Culture, Sports, Tourism, Archaeology & Youth Affairs | Medium | Multi-sector department |
| 34 | Other | Low | Generic category |

### Divisional Commissioners (Type 3) - Missing Users (7)

| ID | Department Name | Priority | Notes |
|----|----------------|----------|-------|
| 35 | Commissioner Bannu Division | Medium | Divisional level |
| 36 | Commissioner DI.Khan Division | Medium | Divisional level |
| 37 | Commissioner Kohat Division | Medium | Divisional level |
| 38 | Commissioner Hazara Division | Medium | Divisional level |
| 39 | Commissioner Malakand Division | Medium | Divisional level |
| 40 | Commissioner Mardan Division | Medium | Divisional level |
| 41 | Commissioner Peshawar Division | Medium | Divisional level |

### Other Departments (Type 4) - Missing Users (5)

| ID | Department Name | Priority | Notes |
|----|----------------|----------|-------|
| 43 | DG PDA | Medium | Peshawar Development Authority |
| 46 | Department | Low | Generic placeholder |
| 47 | NHA | Medium | National Highway Authority |
| 48 | PESCO | Medium | Peshawar Electric Supply Company |
| 49 | WAPDA | Medium | Water and Power Development Authority |

---

## 🎯 Recommended Priority for Adding Users

### High Priority (Critical for Testing)
1. **ST & IT (ID: 9)** - Technology department, likely has many permissions
2. **PHE (ID: 29)** - Public Health Engineering, important for infrastructure

### Medium Priority (Common Departments)
3. **Law (ID: 6)** - Legal department
4. **Excise & Taxation (ID: 13)** - Revenue collection
5. **Food (ID: 15)** - Food security
6. **Industries (ID: 17)** - Industrial development
7. **Labour (ID: 19)** - Labor affairs
8. **Zakat & Ushr (ID: 24)** - Religious tax
9. **Minerals Development (ID: 26)** - Mining
10. **Population Welfare (ID: 28)** - Population control
11. **Culture, Sports, Tourism, Archaeology & Youth Affairs (ID: 33)** - Multi-sector
12. **Relief Rehabilitation & Settlement (ID: 11)** - Disaster management
13. **Auqaf (ID: 4)** - Religious Endowments
14. **IPC (ID: 23)** - Population Census

### Low Priority (Less Common or Admin-Only)
15. **Administration (ID: 1)** - Usually admin-only
16. **Establishment (ID: 12)** - HR/Admin
17. **Other (ID: 34)** - Generic
18. **Department (ID: 46)** - Placeholder
19. **Divisional Commissioners (35-41)** - May not need department users
20. **DG PDA, NHA, PESCO, WAPDA (43, 47-49)** - External organizations

---

## 📝 Suggested Test Users to Add

### High Priority Users

```typescript
// ST & IT Department
{
  id: 32,
  name: 'Dr. Sajid Ali',
  email: 'sajid.ali@st-it.gov.pk',
  department_id: 9,
  // Permissions: All department permissions
}

// PHE Department
{
  id: 33,
  name: 'Engr. Naveed Khan',
  email: 'naveed.khan@phe.gov.pk',
  department_id: 29,
  // Permissions: All department permissions
}
```

### Medium Priority Users

```typescript
// Law Department
{
  id: 34,
  name: 'Adv. Farooq Ahmed',
  email: 'farooq.ahmed@law.gov.pk',
  department_id: 6,
}

// Excise & Taxation
{
  id: 35,
  name: 'Tariq Mehmood',
  email: 'tariq.mehmood@excise.gov.pk',
  department_id: 13,
}

// Food Department
{
  id: 36,
  name: 'Shahid Iqbal',
  email: 'shahid.iqbal@food.gov.pk',
  department_id: 15,
}

// Industries
{
  id: 37,
  name: 'Asim Raza',
  email: 'asim.raza@industries.gov.pk',
  department_id: 17,
}

// Labour
{
  id: 38,
  name: 'Sadia Khan',
  email: 'sadia.khan@labour.gov.pk',
  department_id: 19,
}
```

---

## 🔍 Verification Checklist

- [ ] Check old CMDMS database/seeder for all departments
- [ ] Verify which departments have active users in production
- [ ] Check permission assignments per department
- [ ] Identify most commonly used departments
- [ ] Add test users for high-priority departments
- [ ] Update test credentials document

---

## 📚 Reference

- **Business Rules:** `BUSINESS_RULES.md` - Lists all 47 KP Government Departments
- **Departments Data:** `src/lib/mocks/data/departments.ts`
- **Users Data:** `src/lib/mocks/data/users.ts`
- **Test Credentials:** `docs/DEPARTMENT_TEST_CREDENTIALS.md`

---

**Last Updated:** December 2025  
**Status:** Analysis Complete - Ready for User Addition


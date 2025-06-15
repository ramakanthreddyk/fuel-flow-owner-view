
# Frontend-Backend Interface Contract

This document lists the expected API routes, request payloads, and response shapes as used by the frontend.

---

### 1. Create Owner (Signup)
**Route:** POST `/api/users`  
**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "owner"
}
```
**Response:**
```json
{
  "id": "string",
  "name": "string",
  "role": "string"
}
```

---

### 2. Create Employee
**Route:** POST `/api/users`  
**Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "employee"
}
```
**Response:**
```json
{
  "id": "string",
  "name": "string",
  "role": "string"
}
```

---

### 3. Edit User
**Route:** PUT `/api/users/{id}`  
**Body:**
```json
{
  "name": "string",
  "email": "string",
  "role": "superadmin" | "owner" | "employee"
}
```
**Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "role": "string"
}
```

---

### 4. Get Users List
**Route:** GET `/api/users`  
**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "string"
  },
  // ...
]
```

---

### 5. Create Station
**Route:** POST `/api/stations`  
**Body:**
```json
{
  "name": "string",
  "brand": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "planId": "free" | "premium"
}
```
**Response:**
```json
{
  "id": "string",
  "name": "string",
  "ownerId": "string"
}
```

---

### 6. Get Stations List
**Route:** GET `/api/stations`
**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "address": "string",
    "city": "string",
    "state": "string"
  },
  // ...
]
```

---

### 7. Add Pump
**Route:** POST `/api/pumps`
**Body:**
```json
{
  "stationId": "string",
  "label": "string"
}
```
**Response:**
```json
{
  "id": "string",
  "label": "string",
  "stationId": "string"
}
```

---

### 8. Add Nozzle
**Route:** POST `/api/nozzles`
**Body:**
```json
{
  "pumpId": "string",
  "label": "string",
  "fuelType": "petrol" | "diesel",
  "initialReading": "number"
}
```
**Response:**
```json
{
  "id": "string",
  "label": "string",
  "pumpId": "string"
}
```

---

### 9. List Nozzles for Station
**Route:** GET `/api/nozzles?station_id={stationId}`  
**Response:**
```json
[
  {
    "id": "string",
    "label": "string",
    "pumpId": "string",
    "fuelType": "string",   // e.g., 'petrol' or 'diesel'
    "initialReading": "number"
  },
  // ...
]
```

---

### 10. Submit Manual Reading
**Route:** POST `/api/manual-readings`  
**Body:**
```json
{
  "stationId": "string",
  "nozzleId": "string",
  "cumulativeVolume": "number",
  "readingDatetime": "string", // ISO date
  "method": "manual"
}
```
**Response:**
```json
{
  "id": "string",
  "method": "manual",
  "nozzleId": "string",
  "stationId": "string",
  "cumulativeVolume": "number",
  "recordedAt": "string"
}
```

---

### 11. Submit OCR Reading
**Route:** POST `/api/ocr-readings`  
**Body:** *(form-data/multipart)*
- StationId
- nozzleId
- cumulativeVolume (optional, float)
- readingDatetime (ISO string)
- method ("ocr")
- image: file (binary)

**Response:**  
```json
{
  "id": "string",
  "nozzleId": "string",
  "cumulativeVolume": "number",
  "recordedAt": "string",
  "method": "ocr",
  "imageUrl": "string"
}
```
---

### 12. Submit Tender Entry
**Route:** POST `/api/tenders`  
**Body:**
```json
{
  "stationId": "string",
  "entryDate": "string",   // yyyy-mm-dd
  "tenderType": "cash" | "upi" | "card" | "credit",
  "amount": "number",
  "remarks": "string"
}
```
**Response:**
```json
{
  "id": "string",
  "stationId": "string",
  "entryDate": "string",
  "tenderType": "string",
  "amount": "number",
  "remarks": "string"
}
```

---

### 13. Submit Tank Refill
**Route:** POST `/api/refills`  
**Body:**
```json
{
  "stationId": "string",
  "fuelType": "petrol" | "diesel",
  "refillLitres": "number",
  "refillTime": "string", // ISO datetime
  "filledBy": "string"
}
```
**Response:**
```json
{
  "id": "string",
  "stationId": "string",
  "fuelType": "string",
  "refillLitres": "number",
  "refillTime": "string",
  "filledBy": "string"
}
```

---

### 14. List Employees
**Route:** GET `/api/employees`  
**Response:**
```json
[
  {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "employee"
  },
  // ...
]
```
---

*Other APIs:*
- Additional dashboard/station summary routes are used, but only the main CRUD/data-entry endpoints are described here.

---

_Last updated: 2025-06-15_

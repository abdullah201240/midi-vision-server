# Medicine Management API Documentation

## Overview
Complete Medicine Management System with multiple image upload support using Multer.

## Features
- ✅ Add medicines with multiple images (up to 10 images)
- ✅ View all medicines
- ✅ View single medicine details
- ✅ Update medicine information and add more images
- ✅ Delete medicine (auto-deletes associated images)
- ✅ Delete individual images from a medicine
- ✅ Image upload validation (JPEG, JPG, PNG, GIF, WEBP)
- ✅ File size limit: 5MB per image
- ✅ Static file serving for uploaded images
- ✅ JWT authentication for write operations

## Endpoints

### 1. Create Medicine (with images)
**POST** `/medicines`
**Auth Required:** Yes (JWT Token)
**Content-Type:** `multipart/form-data`

**Form Data:**
```
name: "Paracetamol" (required)
details: "Pain reliever and fever reducer" (required)
origin: "India" (optional)
sideEffects: "Nausea, skin rash" (optional)
usage: "For fever and mild to moderate pain" (optional)
howToUse: "Take 1-2 tablets every 4-6 hours" (optional)
images: [file1.jpg, file2.jpg, ...] (optional, max 10 files)
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Paracetamol",
  "details": "Pain reliever and fever reducer",
  "origin": "India",
  "sideEffects": "Nausea, skin rash",
  "usage": "For fever and mild to moderate pain",
  "howToUse": "Take 1-2 tablets every 4-6 hours",
  "images": ["uuid-image1.jpg", "uuid-image2.jpg"]
}
```

### 2. Get All Medicines
**GET** `/medicines`
**Auth Required:** No

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Paracetamol",
    "details": "Pain reliever and fever reducer",
    "origin": "India",
    "sideEffects": "Nausea, skin rash",
    "usage": "For fever and mild to moderate pain",
    "howToUse": "Take 1-2 tablets every 4-6 hours",
    "images": ["uuid-image1.jpg", "uuid-image2.jpg"]
  }
]
```

### 3. Get Single Medicine
**GET** `/medicines/:id`
**Auth Required:** No

**Response:**
```json
{
  "id": "uuid",
  "name": "Paracetamol",
  "details": "Pain reliever and fever reducer",
  "origin": "India",
  "sideEffects": "Nausea, skin rash",
  "usage": "For fever and mild to moderate pain",
  "howToUse": "Take 1-2 tablets every 4-6 hours",
  "images": ["uuid-image1.jpg", "uuid-image2.jpg"]
}
```

### 4. Update Medicine (add more images)
**PATCH** `/medicines/:id`
**Auth Required:** Yes (JWT Token)
**Content-Type:** `multipart/form-data`

**Form Data:**
```
name: "Updated Paracetamol" (optional)
details: "Updated description" (optional)
origin: "USA" (optional)
sideEffects: "Updated side effects" (optional)
usage: "Updated usage" (optional)
howToUse: "Updated instructions" (optional)
images: [newfile1.jpg, newfile2.jpg] (optional - these will be ADDED to existing images)
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Updated Paracetamol",
  "details": "Updated description",
  "origin": "USA",
  "sideEffects": "Updated side effects",
  "usage": "Updated usage",
  "howToUse": "Updated instructions",
  "images": ["old-image1.jpg", "old-image2.jpg", "new-image1.jpg", "new-image2.jpg"]
}
```

### 5. Delete Medicine
**DELETE** `/medicines/:id`
**Auth Required:** Yes (JWT Token)

**Response:**
```json
{
  "message": "Medicine deleted successfully"
}
```

### 6. Delete Single Image from Medicine
**DELETE** `/medicines/:id/images/:imageName`
**Auth Required:** Yes (JWT Token)

**Example:** `DELETE /medicines/uuid-123/images/uuid-image1.jpg`

**Response:**
```json
{
  "id": "uuid-123",
  "name": "Paracetamol",
  "details": "Pain reliever and fever reducer",
  "images": ["uuid-image2.jpg"]
}
```

### 7. Access Uploaded Images
**GET** `/uploads/medicines/:imageName`
**Auth Required:** No

**Example:** `GET /uploads/medicines/uuid-image1.jpg`

## Usage Examples

### Using cURL

#### 1. Login First
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"Password123!"}'
```

#### 2. Create Medicine with Images
```bash
curl -X POST http://localhost:3000/medicines \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Paracetamol" \
  -F "details=Pain reliever and fever reducer" \
  -F "origin=India" \
  -F "sideEffects=Nausea, skin rash" \
  -F "usage=For fever and mild pain" \
  -F "howToUse=Take 1-2 tablets every 4-6 hours" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

#### 3. Get All Medicines
```bash
curl -X GET http://localhost:3000/medicines
```

#### 4. Update Medicine
```bash
curl -X PATCH http://localhost:3000/medicines/MEDICINE_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Updated Paracetamol" \
  -F "images=@/path/to/new-image.jpg"
```

#### 5. Delete Image
```bash
curl -X DELETE http://localhost:3000/medicines/MEDICINE_ID/images/IMAGE_NAME.jpg \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman

#### Create Medicine with Images:
1. Method: POST
2. URL: `http://localhost:3000/medicines`
3. Headers:
   - Authorization: `Bearer YOUR_TOKEN`
4. Body: Select "form-data"
   - Add text fields: name, details, origin, sideEffects, usage, howToUse
   - Add file fields: images (select multiple files)
5. Send Request

#### Get All Medicines:
1. Method: GET
2. URL: `http://localhost:3000/medicines`
3. Send Request (No auth needed)

## Image Upload Details

### Supported Formats
- JPEG (.jpeg, .jpg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Limits
- Maximum file size: 5MB per image
- Maximum images per request: 10 images
- Total images per medicine: Unlimited (can add more via update)

### Storage
- Images are stored in: `/uploads/medicines/`
- Images are named with UUID to prevent conflicts
- Original file extensions are preserved

## Authentication

All **write operations** (POST, PATCH, DELETE) require JWT authentication:

1. Login to get token
2. Include token in headers: `Authorization: Bearer YOUR_TOKEN`
3. Or use cookie-based authentication (automatic)

## Error Responses

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Only image files (jpeg, jpg, png, gif, webp) are allowed!",
  "error": "Bad Request"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Medicine with ID \"uuid\" not found",
  "error": "Not Found"
}
```

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

## Notes

- Images are automatically deleted when medicine is deleted
- When updating, new images are ADDED to existing images (not replaced)
- Use the delete image endpoint to remove specific images
- Image URLs: `http://localhost:3000/uploads/medicines/IMAGE_NAME.jpg`
- All endpoints return data without `createdAt` and `updatedAt` timestamps

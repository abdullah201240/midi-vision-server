# Medicine Seeding Guide with Images

## Overview
This guide will help you add 10 medicines with images to your MediVision system.

## Step 1: Run Database Migration (if not done yet)

```bash
cd d:\my\midi-vision-server
npm run db:migrate
```

## Step 2: Create Uploads Directory

Create the directory structure:
```
d:\my\midi-vision-server\uploads\medicines\
```

## Step 3: Download Medicine Images

Download the following medicine images from Google and save them in `d:\my\midi-vision-server\uploads\medicines\`:

### Image List (10 medicines):

1. **paracetamol.jpg**
   - Search: "Napa paracetamol Bangladesh packaging"
   - Alternative: "paracetamol tablet box"

2. **omeprazole.jpg**
   - Search: "Seclo omeprazole Bangladesh packaging"
   - Alternative: "omeprazole capsule box"

3. **amoxicillin.jpg**
   - Search: "Amoxil amoxicillin packaging"
   - Alternative: "amoxicillin capsule box"

4. **metformin.jpg**
   - Search: "Glucomin metformin Bangladesh"
   - Alternative: "metformin tablet box"

5. **atorvastatin.jpg**
   - Search: "Atorin atorvastatin packaging"
   - Alternative: "atorvastatin tablet box"

6. **cetirizine.jpg**
   - Search: "Alatrol cetirizine Bangladesh"
   - Alternative: "cetirizine tablet box"

7. **azithromycin.jpg**
   - Search: "Azithrocin Bangladesh packaging"
   - Alternative: "azithromycin tablet box"

8. **losartan.jpg**
   - Search: "Losectil losartan packaging"
   - Alternative: "losartan tablet box"

9. **ranitidine.jpg**
   - Search: "Zantac ranitidine packaging"
   - Alternative: "ranitidine tablet box"

10. **montelukast.jpg**
    - Search: "Montela montelukast Bangladesh"
    - Alternative: "montelukast tablet box"

### Image Requirements:
- Format: JPG, PNG, or JPEG
- Size: Preferably less than 5MB
- Quality: Clear product image showing packaging
- Naming: Exactly as listed above (lowercase)

## Step 4: Run the Seed Script

After placing all images in the folder, run:

```bash
cd d:\my\midi-vision-server
npm run seed:medicines
```

## Step 5: Verify

1. Start the server:
   ```bash
   npm run start:dev
   ```

2. Open admin panel: `http://localhost:3001`

3. Login with admin credentials

4. Navigate to Medicines page

5. You should see 10 medicines with complete information in English and Bengali

## Medicine Data Included

All 10 medicines include:
- ✅ English Name & Bengali Name (বাংলা নাম)
- ✅ Brand Name (English & Bengali)
- ✅ Detailed Description (English & Bengali)
- ✅ Origin/Manufacturer (English & Bengali)
- ✅ Usage Information (English & Bengali)
- ✅ How to Use / Dosage (English & Bengali)
- ✅ Side Effects (English & Bengali)
- ✅ Image reference

## Medicines List:

1. **Paracetamol (প্যারাসিটামল)** - Napa - Pain reliever & fever reducer
2. **Omeprazole (ওমিপ্রাজল)** - Seclo - Acid reflux treatment
3. **Amoxicillin (অ্যামোক্সিসিলিন)** - Amoxil - Antibiotic
4. **Metformin (মেটফরমিন)** - Glucomin - Diabetes medication
5. **Atorvastatin (অ্যাটরভাস্ট্যাটিন)** - Atorin - Cholesterol medication
6. **Cetirizine (সেটিরিজিন)** - Alatrol - Allergy medication
7. **Azithromycin (অ্যাজিথ্রোমাইসিন)** - Azithrocin - Antibiotic
8. **Losartan (লোসার্টান)** - Losectil - Blood pressure medication
9. **Ranitidine (রেনিটিডিন)** - Zantac - Acid reducer
10. **Montelukast (মন্টেলুকাস্ট)** - Montela - Asthma medication

## Troubleshooting

**Issue**: Images not showing
- Check file names match exactly (lowercase)
- Verify files are in `uploads/medicines/` folder
- Check file extensions are .jpg, .jpeg, or .png

**Issue**: Seed script fails
- Make sure database migration is run first
- Check database connection in .env file
- Ensure server is not running during seeding

**Issue**: Duplicate medicines
- The script checks for existing medicines
- Safe to run multiple times

## Quick Setup Commands

```bash
# 1. Create directory
mkdir d:\my\midi-vision-server\uploads\medicines

# 2. Download images (manual step - use browser)

# 3. Run migration
cd d:\my\midi-vision-server
npm run db:migrate

# 4. Seed medicines
npm run seed:medicines

# 5. Start server
npm run start:dev
```

## Notes

- All medicine data is based on common Bangladeshi pharmaceutical brands
- Information is for educational/demo purposes
- Always consult healthcare professionals for actual medical advice
- Images should show actual product packaging for authenticity

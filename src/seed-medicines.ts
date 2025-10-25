import { AppDataSource } from './data-source';
import { Medicine } from './medicines/entities/medicine.entity';

const medicinesData = [
  {
    name: 'Paracetamol',
    nameBn: 'প্যারাসিটামল',
    brand: 'Napa',
    brandBn: 'নাপা',
    details: 'Paracetamol is a pain reliever and a fever reducer used to treat many conditions such as headache, muscle aches, arthritis, backache, toothaches, colds, and fevers.',
    detailsBn: 'প্যারাসিটামল একটি ব্যথানাশক এবং জ্বর কমানোর ওষুধ যা মাথাব্যথা, পেশী ব্যথা, বাত, পিঠব্যথা, দাঁতব্যথা, সর্দি এবং জ্বরের মতো অনেক অবস্থার চিকিৎসায় ব্যবহৃত হয়।',
    origin: 'Square Pharmaceuticals Ltd., Bangladesh',
    originBn: 'স্কয়ার ফার্মাসিউটিক্যালস লিমিটেড, বাংলাদেশ',
    usage: 'Used for relief of mild to moderate pain and fever.',
    usageBn: 'হালকা থেকে মাঝারি ব্যথা এবং জ্বর উপশমের জন্য ব্যবহৃত হয়।',
    howToUse: 'Adults: 500-1000mg every 4-6 hours. Maximum 4000mg per day. Children: Consult doctor.',
    howToUseBn: 'প্রাপ্তবয়স্ক: প্রতি ৪-৬ ঘন্টায় ৫০০-১০০০মিগ্রা। সর্বোচ্চ প্রতিদিন ৪০০০মিগ্রা। শিশু: ডাক্তারের পরামর্শ নিন।',
    sideEffects: 'Rare: Allergic reactions, liver damage (with overdose), skin rash.',
    sideEffectsBn: 'বিরল: এলার্জি প্রতিক্রিয়া, লিভারের ক্ষতি (অতিরিক্ত মাত্রায়), ত্বকে ফুসকুড়ি।',
  },
  {
    name: 'Omeprazole',
    nameBn: 'ওমিপ্রাজল',
    brand: 'Seclo',
    brandBn: 'সেক্লো',
    details: 'Omeprazole is a proton pump inhibitor that decreases the amount of acid produced in the stomach. It treats gastroesophageal reflux disease (GERD), ulcers, and other conditions.',
    detailsBn: 'ওমিপ্রাজল একটি প্রোটন পাম্প ইনহিবিটর যা পেটে উৎপাদিত অ্যাসিডের পরিমাণ হ্রাস করে। এটি গ্যাস্ট্রোইসোফেজিয়াল রিফ্লাক্স ডিজিজ (GERD), আলসার এবং অন্যান্য অবস্থার চিকিৎসা করে।',
    origin: 'Incepta Pharmaceuticals Ltd., Bangladesh',
    originBn: 'ইনসেপ্টা ফার্মাসিউটিক্যালস লিমিটেড, বাংলাদেশ',
    usage: 'Treats heartburn, acid reflux, stomach ulcers, and prevents ulcers.',
    usageBn: 'বুক জ্বালাপোড়া, অ্যাসিড রিফ্লাক্স, পেটের আলসার চিকিৎসা করে এবং আলসার প্রতিরোধ করে।',
    howToUse: 'Adults: 20-40mg once daily before breakfast. Take whole, do not crush. Duration: 4-8 weeks.',
    howToUseBn: 'প্রাপ্তবয়স্ক: প্রতিদিন সকালের নাস্তার আগে একবার ২০-৪০মিগ্রা। পুরো গিলে ফেলুন, ভাঙবেন না। সময়কাল: ৪-৮ সপ্তাহ।',
    sideEffects: 'Headache, nausea, diarrhea, stomach pain, gas, constipation.',
    sideEffectsBn: 'মাথাব্যথা, বমি বমি ভাব, ডায়রিয়া, পেট ব্যথা, গ্যাস, কোষ্ঠকাঠিন্য।',
  },
  {
    name: 'Amoxicillin',
    nameBn: 'অ্যামোক্সিসিলিন',
    brand: 'Amoxil',
    brandBn: 'অ্যামক্সিল',
    details: 'Amoxicillin is a penicillin antibiotic that fights bacteria. It is used to treat many different types of infections caused by bacteria.',
    detailsBn: 'অ্যামোক্সিসিলিন একটি পেনিসিলিন অ্যান্টিবায়োটিক যা ব্যাকটেরিয়ার বিরুদ্ধে লড়াই করে। এটি ব্যাকটেরিয়া দ্বারা সৃষ্ট বিভিন্ন ধরনের সংক্রমণের চিকিৎসায় ব্যবহৃত হয়।',
    origin: 'Beximco Pharmaceuticals Ltd., Bangladesh',
    originBn: 'বেক্সিমকো ফার্মাসিউটিক্যালস লিমিটেড, বাংলাদেশ',
    usage: 'Treats bacterial infections: pneumonia, bronchitis, ear, nose, throat, urinary tract infections.',
    usageBn: 'ব্যাকটেরিয়া সংক্রমণের চিকিৎসা: নিউমোনিয়া, ব্রঙ্কাইটিস, কান, নাক, গলা, মূত্রনালীর সংক্রমণ।',
    howToUse: 'Adults: 250-500mg every 8 hours or 500-875mg every 12 hours. Complete full course.',
    howToUseBn: 'প্রাপ্তবয়স্ক: প্রতি ৮ ঘন্টায় ২৫০-৫০০মিগ্রা বা প্রতি ১২ ঘন্টায় ৫০০-৮৭৫মিগ্রা। সম্পূর্ণ কোর্স শেষ করুন।',
    sideEffects: 'Nausea, vomiting, diarrhea, allergic reactions, skin rash.',
    sideEffectsBn: 'বমি বমি ভাব, বমি, ডায়রিয়া, এলার্জি প্রতিক্রিয়া, ত্বকে ফুসকুড়ি।',
  },
  {
    name: 'Metformin',
    nameBn: 'মেটফরমিন',
    brand: 'Glucomin',
    brandBn: 'গ্লুকোমিন',
    details: 'Metformin is an oral diabetes medicine that helps control blood sugar levels. Used to treat type 2 diabetes.',
    detailsBn: 'মেটফরমিন একটি মুখে খাওয়ার ডায়াবেটিসের ওষুধ যা রক্তে শর্করার মাত্রা নিয়ন্ত্রণে সাহায্য করে। টাইপ ২ ডায়াবেটিসের চিকিৎসায় ব্যবহৃত হয়।',
    origin: 'Renata Limited, Bangladesh',
    originBn: 'রেনাটা লিমিটেড, বাংলাদেশ',
    usage: 'Controls high blood sugar in people with type 2 diabetes.',
    usageBn: 'টাইপ ২ ডায়াবেটিসে আক্রান্ত ব্যক্তিদের উচ্চ রক্তে শর্করা নিয়ন্ত্রণ করে।',
    howToUse: 'Start: 500mg twice daily with meals. Maximum: 2000-2500mg per day in divided doses.',
    howToUseBn: 'শুরু: খাবারের সাথে দিনে দুবার ৫০০মিগ্রা। সর্বোচ্চ: ভাগ করে প্রতিদিন ২০০০-২৫০০মিগ্রা।',
    sideEffects: 'Diarrhea, nausea, upset stomach, metallic taste, vitamin B12 deficiency.',
    sideEffectsBn: 'ডায়রিয়া, বমি বমি ভাব, পেট খারাপ, ধাতব স্বাদ, ভিটামিন বি১২ এর ঘাটতি।',
  },
  {
    name: 'Atorvastatin',
    nameBn: 'অ্যাটরভাস্ট্যাটিন',
    brand: 'Atorin',
    brandBn: 'অ্যাটোরিন',
    details: 'Atorvastatin is a statin medication used to prevent cardiovascular disease and treat abnormal lipid levels.',
    detailsBn: 'অ্যাটরভাস্ট্যাটিন একটি স্ট্যাটিন ওষুধ যা হৃদরোগ প্রতিরোধ করতে এবং অস্বাভাবিক লিপিড মাত্রার চিকিৎসায় ব্যবহৃত হয়।',
    origin: 'ACI Limited, Bangladesh',
    originBn: 'এসিআই লিমিটেড, বাংলাদেশ',
    usage: 'Lowers cholesterol and reduces risk of stroke, heart attack.',
    usageBn: 'কোলেস্টেরল কমায় এবং স্ট্রোক, হার্ট অ্যাটাকের ঝুঁকি হ্রাস করে।',
    howToUse: 'Adults: 10-80mg once daily. Can be taken any time, with or without food.',
    howToUseBn: 'প্রাপ্তবয়স্ক: দিনে একবার ১০-৮০মিগ্রা। যেকোনো সময়, খাবারের সাথে বা ছাড়া নেওয়া যায়।',
    sideEffects: 'Muscle pain, weakness, digestive problems, liver problems.',
    sideEffectsBn: 'পেশী ব্যথা, দুর্বলতা, হজমের সমস্যা, লিভারের সমস্যা।',
    images: ['atorvastatin.jpg']
  },
  {
    name: 'Cetirizine',
    nameBn: 'সেটিরিজিন',
    brand: 'Alatrol',
    brandBn: 'অ্যালাট্রল',
    details: 'Cetirizine is an antihistamine that reduces the effects of natural chemical histamine in the body.',
    detailsBn: 'সেটিরিজিন একটি অ্যান্টিহিস্টামিন যা শরীরে প্রাকৃতিক রাসায়নিক হিস্টামিনের প্রভাব হ্রাস করে।',
    origin: 'Healthcare Pharmaceuticals Ltd., Bangladesh',
    originBn: 'হেলথকেয়ার ফার্মাসিউটিক্যালস লিমিটেড, বাংলাদেশ',
    usage: 'Treats allergy symptoms: sneezing, itching, watery eyes, runny nose.',
    usageBn: 'এলার্জির লক্ষণগুলির চিকিৎসা: হাঁচি, চুলকানি, চোখ দিয়ে পানি পড়া, সর্দি।',
    howToUse: 'Adults and children 6+: 5-10mg once daily. Can be taken with or without food.',
    howToUseBn: 'প্রাপ্তবয়স্ক এবং ৬+ বছরের শিশু: দিনে একবার ৫-১০মিগ্রা। খাবারের সাথে বা ছাড়া নেওয়া যায়।',
    sideEffects: 'Drowsiness, dry mouth, fatigue, headache.',
    sideEffectsBn: 'তন্দ্রাভাব, শুষ্ক মুখ, ক্লান্তি, মাথাব্যথা।',
    images: ['cetirizine.jpg']
  },
  {
    name: 'Azithromycin',
    nameBn: 'অ্যাজিথ্রোমাইসিন',
    brand: 'Azithrocin',
    brandBn: 'অ্যাজিথ্রোসিন',
    details: 'Azithromycin is a macrolide antibiotic that fights bacteria. Used to treat many different types of infections.',
    detailsBn: 'অ্যাজিথ্রোমাইসিন একটি ম্যাক্রোলাইড অ্যান্টিবায়োটিক যা ব্যাকটেরিয়ার বিরুদ্ধে লড়াই করে। বিভিন্ন ধরনের সংক্রমণের চিকিৎসায় ব্যবহৃত হয়।',
    origin: 'Opsonin Pharma Limited, Bangladesh',
    originBn: 'অপসনিন ফার্মা লিমিটেড, বাংলাদেশ',
    usage: 'Treats respiratory infections, skin infections, ear infections, STDs.',
    usageBn: 'শ্বাসযন্ত্রের সংক্রমণ, ত্বকের সংক্রমণ, কানের সংক্রমণ, যৌনবাহিত রোগের চিকিৎসা করে।',
    howToUse: 'Adults: 500mg on day 1, then 250mg once daily for 4 days. Take on empty stomach.',
    howToUseBn: 'প্রাপ্তবয়স্ক: ১ম দিন ৫০০মিগ্রা, তারপর ৪ দিনের জন্য দিনে একবার ২৫০মিগ্রা। খালি পেটে নিন।',
    sideEffects: 'Nausea, diarrhea, abdominal pain, vomiting.',
    sideEffectsBn: 'বমি বমি ভাব, ডায়রিয়া, পেট ব্যথা, বমি।',
    images: ['azithromycin.jpg']
  },
  {
    name: 'Losartan',
    nameBn: 'লোসার্টান',
    brand: 'Losectil',
    brandBn: 'লোসেকটিল',
    details: 'Losartan is an angiotensin receptor blocker (ARB) that treats high blood pressure and helps protect the kidneys from diabetes damage.',
    detailsBn: 'লোসার্টান একটি অ্যাঞ্জিওটেনসিন রিসেপ্টর ব্লকার (ARB) যা উচ্চ রক্তচাপের চিকিৎসা করে এবং ডায়াবেটিসের ক্ষতি থেকে কিডনি রক্ষা করতে সাহায্য করে।',
    origin: 'Aristopharma Ltd., Bangladesh',
    originBn: 'এরিস্টোফার্মা লিমিটেড, বাংলাদেশ',
    usage: 'Treats high blood pressure, reduces stroke risk in heart patients.',
    usageBn: 'উচ্চ রক্তচাপের চিকিৎসা করে, হৃদরোগীদের স্ট্রোকের ঝুঁকি হ্রাস করে।',
    howToUse: 'Adults: Start 50mg once daily. Maximum 100mg daily. Can be taken with or without food.',
    howToUseBn: 'প্রাপ্তবয়স্ক: শুরু দিনে একবার ৫০মিগ্রা। সর্বোচ্চ প্রতিদিন ১০০মিগ্রা। খাবারের সাথে বা ছাড়া নেওয়া যায়।',
    sideEffects: 'Dizziness, stuffy nose, back pain, diarrhea.',
    sideEffectsBn: 'মাথা ঘোরা, নাক বন্ধ, পিঠ ব্যথা, ডায়রিয়া।',
    images: ['losartan.jpg']
  },
  {
    name: 'Ranitidine',
    nameBn: 'রেনিটিডিন',
    brand: 'Zantac',
    brandBn: 'জ্যান্ট্যাক',
    details: 'Ranitidine is an H2 blocker that decreases the amount of acid produced in the stomach.',
    detailsBn: 'রেনিটিডিন একটি H2 ব্লকার যা পেটে উৎপাদিত অ্যাসিডের পরিমাণ হ্রাস করে।',
    origin: 'Drug International Limited, Bangladesh',
    originBn: 'ড্রাগ ইন্টারন্যাশনাল লিমিটেড, বাংলাদেশ',
    usage: 'Treats and prevents ulcers, GERD, heartburn.',
    usageBn: 'আলসার, GERD, বুক জ্বালাপোড়ার চিকিৎসা এবং প্রতিরোধ করে।',
    howToUse: 'Adults: 150mg twice daily or 300mg at bedtime. Take with or without food.',
    howToUseBn: 'প্রাপ্তবয়স্ক: দিনে দুবার ১৫০মিগ্রা বা ঘুমানোর সময় ৩০০মিগ্রা। খাবারের সাথে বা ছাড়া নিন।',
    sideEffects: 'Headache, constipation, diarrhea, nausea.',
    sideEffectsBn: 'মাথাব্যথা, কোষ্ঠকাঠিন্য, ডায়রিয়া, বমি বমি ভাব।',
    images: ['ranitidine.jpg']
  },
  {
    name: 'Montelukast',
    nameBn: 'মন্টেলুকাস্ট',
    brand: 'Montela',
    brandBn: 'মন্টেলা',
    details: 'Montelukast is a leukotriene receptor antagonist used for maintenance treatment of asthma and allergic rhinitis.',
    detailsBn: 'মন্টেলুকাস্ট একটি লিউকোট্রিয়েন রিসেপ্টর প্রতিপক্ষ যা হাঁপানি এবং এলার্জিক রাইনাইটিসের রক্ষণাবেক্ষণ চিকিৎসায় ব্যবহৃত হয়।',
    origin: 'Square Pharmaceuticals Ltd., Bangladesh',
    originBn: 'স্কয়ার ফার্মাসিউটিক্যালস লিমিটেড, বাংলাদেশ',
    usage: 'Prevents asthma attacks, treats seasonal allergies.',
    usageBn: 'হাঁপানির আক্রমণ প্রতিরোধ করে, মৌসুমী এলার্জির চিকিৎসা করে।',
    howToUse: 'Adults: 10mg once daily in evening. Children 6-14: 5mg once daily.',
    howToUseBn: 'প্রাপ্তবয়স্ক: সন্ধ্যায় দিনে একবার ১০মিগ্রা। শিশু ৬-১৪: দিনে একবার ৫মিগ্রা।',
    sideEffects: 'Headache, stomach pain, heartburn, fatigue.',
    sideEffectsBn: 'মাথাব্যথা, পেট ব্যথা, বুক জ্বালাপোড়া, ক্লান্তি।',
    
  }
];

async function seedMedicines() {
  try {
    console.log('🔄 Initializing data source...');
    await AppDataSource.initialize();
    console.log('✅ Data source initialized successfully\n');

    const medicineRepository = AppDataSource.getRepository(Medicine);

    console.log('📦 Starting to seed medicines...\n');
    let addedCount = 0;
    let existingCount = 0;

    for (const medicineData of medicinesData) {
      // Check if medicine already exists
      const existing = await medicineRepository.findOne({
        where: { name: medicineData.name },
      });

      if (existing) {
        console.log(`⚠️  Medicine already exists: ${medicineData.name}`);
        existingCount++;
      } else {
        const medicine = medicineRepository.create(medicineData);
        await medicineRepository.save(medicine);
        console.log(`✅ Added: ${medicineData.name} (${medicineData.nameBn})`);
        addedCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 Medicine Seeding Summary:');
    console.log('='.repeat(60));
    console.log(`✅ Successfully added: ${addedCount} medicine(s)`);
    console.log(`⚠️  Already existing: ${existingCount} medicine(s)`);
    console.log(`📝 Total medicines in data: ${medicinesData.length}`);
    console.log('='.repeat(60));

    console.log('\n📋 Medicine List:');
    medicinesData.forEach((med, index) => {
      console.log(`${index + 1}. ${med.name} (${med.nameBn}) - ${med.brand}`);
    });

    console.log('\n⚠️  IMPORTANT: Image Setup Required!');
    console.log('─'.repeat(60));
    console.log('Please download medicine images and place them in:');
    console.log('📁 d:\\my\\midi-vision-server\\uploads\\medicines\\');
    console.log('\nRequired image files:');
   
    console.log('\n💡 Tip: Search "medicine name + packaging" on Google Images');
    console.log('─'.repeat(60));

    await AppDataSource.destroy();
    console.log('\n✅ Database connection closed.');
  } catch (error) {
    console.error('❌ Error seeding medicines:', error);
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    process.exit(1);
  }
}

seedMedicines();

// cleaning
import floorCleanerImg from '../assets/green products/cleaning/floorcleaner.png';
import dishwashImg from '../assets/green products/cleaning/dishwash.png';
import cleaningClothImg from '../assets/green products/cleaning/cleaningcloth.png';
import powderImg from '../assets/green products/cleaning/powder.png';
import handwashImg from '../assets/green products/cleaning/handwash.png';

// bathroom
import cleanerSprayImg from '../assets/green products/bathroom/cleanerspray.png';
import toiletBowlCleanerImg from '../assets/green products/bathroom/toiletbowlcleaner.png';
import toiletPaperRollImg from '../assets/green products/bathroom/toiletpaperroll.png';

// baby products
import shampooImg1 from '../assets/green products/baby products/shampo.png';
import diapersImg from '../assets/green products/baby products/Diapers.png';
import beddingImg from '../assets/green products/baby products/babybedding.png';

// gardening
import fertilizerImg from '../assets/green products/gardening/fertilizer.png';
import mulchImg from '../assets/green products/gardening/mulch.png';
import plantPotsImg from '../assets/green products/gardening/plantpots.png';

// home decor
import wallHangingImg from '../assets/green products/home decor/wallhanging.png';
import laceRibbonImg from '../assets/green products/home decor/Laceribbon.png';
import figurineImg from '../assets/green products/home decor/hadcraftedFigurine.png';

// kitchen
import basketImg from '../assets/green products/kitchen/basket.png';
import cuttingBoardImg from '../assets/green products/kitchen/cuttingboard.png';
import servingBowlImg from '../assets/green products/kitchen/servingbowl.png';
import vegBagsImg from '../assets/green products/kitchen/vegetablebags.png';
import coastersImg from '../assets/green products/kitchen/woodenCoasters.png';

// Office images
import ballPensImg from '../assets/green products/office/ballpens.png';
import giftSetImg from '../assets/green products/office/giftset.png';
import seedPencilsImg from '../assets/green products/office/seedpencils.png';

// Personal use images
import handcraftedShopImg from '../assets/green products/personaluse/handcraftedshop.png';
import lipBalmImg from '../assets/green products/personaluse/lipbalm.png';
import shampooImg from '../assets/green products/personaluse/shampobar.png';

// Pets images
import areaFreshenerImg from '../assets/green products/pets/areafreshner.png';
import petGroomingImg from '../assets/green products/pets/petgroomingcloth.png';
import petHairRemoverImg from '../assets/green products/pets/pethairremover.png';

// Travel images
import solarChargerImg from '../assets/green products/travel/solarcharger.png';
import toiletriesImg from '../assets/green products/travel/toileteries.png';
import travelMugImg from '../assets/green products/travel/travelmug.png';
import waterBottleImg from '../assets/green products/travel/waterbottle.png';

// 1. Hard-coded JSON data for products including filter flags and category field
export default [
    { id: 3, productName: 'Nimyle Eco-Friendly Floor Cleaner', productImage: floorCleanerImg, price: '$12.49', grade: 'A', filters: { plasticFree: false, fscCertified: false, carbonNeutral: true, recycledMaterials: false }, category: 'Cleaning' },
    { id: 4, productName: "Happi Planet's Eco-friendly Dishwashing Liquid", productImage: dishwashImg, price: '$8.99', grade: 'A', filters: { plasticFree: true, fscCertified: false, carbonNeutral: false, recycledMaterials: true }, category: 'Cleaning' },
    { id: 5, productName: 'SOFTSPUN Microfiber Cleaning Cloths', productImage: cleaningClothImg, price: '$15.50', grade: 'A+', filters: { plasticFree: false, fscCertified: false, carbonNeutral: false, recycledMaterials: false }, category: 'Cleaning' },
    { id: 6, productName: 'Greenworx Ultra Laundry Powder', productImage: powderImg, price: '$11.99', grade: 'B+', filters: { plasticFree: true, fscCertified: false, carbonNeutral: true, recycledMaterials: false }, category: 'Cleaning' },
    { id: 7, productName: "Happi Planet's Liquid Handwash", productImage: handwashImg, price: '$9.75', grade: 'A', filters: { plasticFree: true, fscCertified: false, carbonNeutral: false, recycledMaterials: true }, category: 'Cleaning' },
    { id: 8, productName: 'Herbal Strategi Bathroom Cleaner Spray', productImage: cleanerSprayImg, price: '$14.20', grade: 'A', filters: { plasticFree: false, fscCertified: false, carbonNeutral: true, recycledMaterials: false }, category: 'Bathroom' },
    { id: 9, productName: 'Born Good Plant-Based Liquid Toilet Bowl Cleaner', productImage: toiletBowlCleanerImg, price: '$7.80', grade: 'A', filters: { plasticFree: true, fscCertified: false, carbonNeutral: false, recycledMaterials: false }, category: 'Bathroom' },
    { id: 10, productName: 'Beco Bamboo 3 Ply Toilet Paper Roll', productImage: toiletPaperRollImg, price: '$5.99', grade: 'B+', filters: { plasticFree: false, fscCertified: true, carbonNeutral: false, recycledMaterials: false }, category: 'Bathroom' },
    { id: 11, productName: "Earth Rhythm's Murumuru Butter Shampoo Bar", productImage: shampooImg1, price: '$6.49', grade: 'A', filters: { plasticFree: true, fscCertified: false, carbonNeutral: true, recycledMaterials: false }, category: 'Baby Products' },
    { id: 12, productName: 'Eco-Friendly Diapers', productImage: diapersImg, price: '$19.99', grade: 'A', filters: { plasticFree: false, fscCertified: false, carbonNeutral: false, recycledMaterials: true }, category: 'Baby Products' },
    { id: 13, productName: 'Organic Baby Bedding', productImage: beddingImg, price: '$34.50', grade: 'A', filters: { plasticFree: false, fscCertified: false, carbonNeutral: false, recycledMaterials: false }, category: 'Baby Products' },
    { id: 14, productName: 'Organic Fertilizers', productImage: fertilizerImg, price: '$9.99', grade: 'A', filters: { plasticFree: false, fscCertified: false, carbonNeutral: true, recycledMaterials: false }, category: 'Gardening' },
    { id: 15, productName: 'Mulch (Organic)', productImage: mulchImg, price: '$7.49', grade: 'A-', filters: { plasticFree: false, fscCertified: false, carbonNeutral: false, recycledMaterials: false }, category: 'Gardening' },
    { id: 16, productName: 'Biodegradable Plant Pots', productImage: plantPotsImg, price: '$12.99', grade: 'B+', filters: { plasticFree: false, fscCertified: false, carbonNeutral: false, recycledMaterials: true }, category: 'Gardening' },
    { id: 17, productName: 'Bamboowala Flutist Scenery Decorative Wall Hanging', productImage: wallHangingImg, price: '$24.99', grade: 'A', filters: { plasticFree: false, fscCertified: false, carbonNeutral: true, recycledMaterials: false }, category: 'Home Decor' },
    { id: 18, productName: "HOME BUY's Jute Lace Natural Burlap Rolls", productImage: laceRibbonImg, price: '$13.99', grade: 'A-', filters: { plasticFree: true, fscCertified: false, carbonNeutral: false, recycledMaterials: true }, category: 'Home Decor' },
    { id: 19, productName: 'KARIGAARI Hand Crafted Eco-Friendly Figurine', productImage: figurineImg, price: '$18.49', grade: 'B+', filters: { plasticFree: false, fscCertified: false, carbonNeutral: false, recycledMaterials: false }, category: 'Home Decor' },
    { id: 20, productName: 'Bulfyss Large Natural Bamboo Wood Cutting Board', productImage: cuttingBoardImg, price: '$29.99', grade: 'A+', filters: { plasticFree: true, fscCertified: false, carbonNeutral: false, recycledMaterials: false }, category: 'Kitchen' },
    { id: 21, productName: 'Necavu Eco-friendly Natural Vegetables Bags', productImage: vegBagsImg, price: '$11.50', grade: 'B', filters: { plasticFree: true, fscCertified: false, carbonNeutral: false, recycledMaterials: true }, category: 'Kitchen' },
    { id: 22, productName: 'Irida Naturals Wheat Straw Serving Bowls', productImage: servingBowlImg, price: '$19.99', grade: 'A-', filters: { plasticFree: true, fscCertified: false, carbonNeutral: false, recycledMaterials: false }, category: 'Kitchen' },
    { id: 23, productName: 'Wooden Coasters Set', productImage: coastersImg, price: '$9.99', grade: 'B+', filters: { plasticFree: true, fscCertified: false, carbonNeutral: false, recycledMaterials: false }, category: 'Kitchen' },
    { id: 24, productName: 'Green Chapter Plantable Seed Ball Pens', productImage: ballPensImg, price: '$9.99', grade: 'A', filters: { plasticFree: false, fscCertified: false, carbonNeutral: false, recycledMaterials: true }, category: 'Office' },
    { id: 25, productName: 'CARIGARI Gift Set', productImage: giftSetImg, price: '$24.99', grade: 'A-', filters: { plasticFree: false, fscCertified: true, carbonNeutral: false, recycledMaterials: false }, category: 'Office' },
    { id: 26, productName: 'Plantable Seed Pencils', productImage: seedPencilsImg, price: '$14.99', grade: 'B+', filters: { plasticFree: false, fscCertified: false, carbonNeutral: false, recycledMaterials: true }, category: 'Office' },
    { id: 27, productName: 'Handcrafted Shop Soap', productImage: handcraftedShopImg, price: '$4.99', grade: 'A-', filters: { plasticFree: true, fscCertified: false, carbonNeutral: false, recycledMaterials: false }, category: 'Personal Care' },
    { id: 28, productName: 'Biotique Bio Fruit Lip Balm', productImage: lipBalmImg, price: '$3.75', grade: 'B', filters: { plasticFree: false, fscCertified: false, carbonNeutral: false, recycledMaterials: true }, category: 'Personal Care' },
    { id: 29, productName: 'Personal Shampoo Bar', productImage: shampooImg, price: '$6.49', grade: 'A', filters: { plasticFree: true, fscCertified: false, carbonNeutral: true, recycledMaterials: false }, category: 'Personal Care' },
    { id: 30, productName: 'ODO-RITE Pet Area Freshener', productImage: areaFreshenerImg, price: '$9.50', grade: 'A', filters: { plasticFree: true, fscCertified: false, carbonNeutral: false, recycledMaterials: false }, category: 'Pets' },
    { id: 31, productName: 'NAVA PAVA Pet Hair Remover', productImage: petHairRemoverImg, price: '$7.25', grade: 'B+', filters: { plasticFree: false, fscCertified: false, carbonNeutral: false, recycledMaterials: false }, category: 'Pets' },
    { id: 32, productName: 'Aufews Magic Pet Grooming Gloves', productImage: petGroomingImg, price: '$12.00', grade: 'A', filters: { plasticFree: false, fscCertified: false, carbonNeutral: true, recycledMaterials: false }, category: 'Pets' },
    { id: 33, productName: 'Solar-Powered Charger', productImage: solarChargerImg, price: '$29.99', grade: 'A+', filters: { plasticFree: false, fscCertified: false, carbonNeutral: true, recycledMaterials: false }, category: 'Travel' },
    { id: 34, productName: 'Travel Mug', productImage: travelMugImg, price: '$14.99', grade: 'A', filters: { plasticFree: true, fscCertified: false, carbonNeutral: false, recycledMaterials: false }, category: 'Travel' },
    { id: 35, productName: 'Reusable Water Bottle', productImage: waterBottleImg, price: '$12.99', grade: 'A', filters: { plasticFree: false, fscCertified: false, carbonNeutral: false, recycledMaterials: false }, category: 'Travel' },
    { id: 36, productName: 'Biodegradable Toiletries', productImage: toiletriesImg, price: '$16.50', grade: 'B+', filters: { plasticFree: false, fscCertified: false, carbonNeutral: false, recycledMaterials: true }, category: 'Travel' }
];

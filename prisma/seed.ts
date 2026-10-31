import { PrismaClient, UserRole, MemberTierType } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Database Seeding...");

  // 1. Staff Users & Roles
  const adminPassword = await bcrypt.hash("Admin@123456", 10);
  const cashierPassword = await bcrypt.hash("Cashier@123456", 10);
  const inventoryPassword = await bcrypt.hash("Inventory@123456", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@store.com" },
    update: {},
    create: {
      email: "admin@store.com",
      name: "System Super Admin",
      phone: "+8801700000001",
      passwordHash: adminPassword,
      role: UserRole.SUPER_ADMIN,
    },
  });

  const cashier = await prisma.user.upsert({
    where: { email: "cashier@store.com" },
    update: {},
    create: {
      email: "cashier@store.com",
      name: "Front Cashier",
      phone: "+8801700000002",
      passwordHash: cashierPassword,
      role: UserRole.POS_CASHIER,
    },
  });

  const inventoryManager = await prisma.user.upsert({
    where: { email: "inventory@store.com" },
    update: {},
    create: {
      email: "inventory@store.com",
      name: "Inventory Manager",
      phone: "+8801700000003",
      passwordHash: inventoryPassword,
      role: UserRole.INVENTORY_MANAGER,
    },
  });

  console.log("✅ Seeded Staff Users (Super Admin, Cashier, Inventory Manager)");

  // 2. Membership Tiers
  const silverTier = await prisma.membershipTier.upsert({
    where: { name: MemberTierType.SILVER },
    update: {},
    create: {
      name: MemberTierType.SILVER,
      minSpendThreshold: 0.0,
      earnMultiplier: 1.0,
      perkDescription: "Base loyalty member, earn 1 point per ৳100 spent.",
    },
  });

  const goldTier = await prisma.membershipTier.upsert({
    where: { name: MemberTierType.GOLD },
    update: {},
    create: {
      name: MemberTierType.GOLD,
      minSpendThreshold: 10000.0,
      earnMultiplier: 1.25,
      perkDescription: "Gold VIP, earn 1.25x points + priority checkout.",
    },
  });

  const platinumTier = await prisma.membershipTier.upsert({
    where: { name: MemberTierType.PLATINUM },
    update: {},
    create: {
      name: MemberTierType.PLATINUM,
      minSpendThreshold: 25000.0,
      earnMultiplier: 1.5,
      perkDescription: "Platinum VIP, earn 1.5x points + free home delivery.",
    },
  });

  console.log("✅ Seeded Membership Tiers (Silver, Gold, Platinum)");

  // 3. System Settings
  const defaultSettings = [
    { key: "LOYALTY_EARN_SPEND_RATIO", value: "100", description: "Spent amount required to earn 1 point" },
    { key: "LOYALTY_POINT_REDEEM_VALUE", value: "1.0", description: "Taka value of 1 point" },
    { key: "LOYALTY_MIN_REDEEM_POINTS", value: "50", description: "Minimum points needed to redeem" },
    { key: "LOYALTY_MAX_REDEEM_PERCENT", value: "25", description: "Maximum % of order total payable with points" },
    { key: "STORE_NAME", value: "Metro Retail & Lifestyle", description: "Official store title" },
    { key: "STORE_PHONE", value: "+880 1800-000000", description: "Customer support helpline" },
    { key: "STORE_ADDRESS", value: "Gulshan-2, Dhaka 1212, Bangladesh", description: "Physical store address" },
  ];

  for (const setting of defaultSettings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log("✅ Seeded System Settings");

  // 4. Default Categories
  const menCategory = await prisma.category.upsert({
    where: { slug: "mens-collection" },
    update: {},
    create: {
      name: "Men's Collection",
      slug: "mens-collection",
      imageUrl: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=600&auto=format&fit=crop&q=80",
    },
  });

  const womenCategory = await prisma.category.upsert({
    where: { slug: "womens-collection" },
    update: {},
    create: {
      name: "Women's Collection",
      slug: "womens-collection",
      imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&auto=format&fit=crop&q=80",
    },
  });

  // 5. Default Brand
  const brand = await prisma.brand.upsert({
    where: { slug: "apex-urban" },
    update: {},
    create: {
      name: "Apex Urban",
      slug: "apex-urban",
    },
  });

  // 6. Demo Product with Variants & Centralized Stock
  const existingProduct = await prisma.product.findUnique({
    where: { slug: "premium-oxford-cotton-shirt" },
  });

  if (!existingProduct) {
    const product = await prisma.product.create({
      data: {
        title: "Premium Oxford Cotton Shirt",
        slug: "premium-oxford-cotton-shirt",
        description: "Tailored fit breathable 100% combed cotton shirt suitable for office and casual wear.",
        basePrice: 1850.0,
        discountPrice: 1650.0,
        categoryId: menCategory.id,
        brandId: brand.id,
        isFeatured: true,
        isTrending: true,
        images: [
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
        ],
        variants: {
          create: [
            {
              sku: "SHT-OXF-BLU-M",
              barcode: "890123456701",
              size: "M",
              color: "Classic Blue",
              price: 1650.0,
              costPrice: 1100.0,
              inventory: {
                create: {
                  quantity: 45,
                  lowStockAlert: 5,
                  shelfLocation: "A1-R2",
                },
              },
            },
            {
              sku: "SHT-OXF-BLU-L",
              barcode: "890123456702",
              size: "L",
              color: "Classic Blue",
              price: 1650.0,
              costPrice: 1100.0,
              inventory: {
                create: {
                  quantity: 30,
                  lowStockAlert: 5,
                  shelfLocation: "A1-R2",
                },
              },
            },
            {
              sku: "SHT-OXF-WHT-M",
              barcode: "890123456703",
              size: "M",
              color: "Crisp White",
              price: 1650.0,
              costPrice: 1100.0,
              inventory: {
                create: {
                  quantity: 25,
                  lowStockAlert: 5,
                  shelfLocation: "A1-R3",
                },
              },
            },
          ],
        },
      },
    });

    console.log(`✅ Seeded Product & 3 Variants with Stock: ${product.title}`);
  }

  // 7. Seed Demo Customer & Membership
  const demoCustomer = await prisma.customer.upsert({
    where: { phone: "+8801811223344" },
    update: {},
    create: {
      phone: "+8801811223344",
      name: "Tanvir Ahmed",
      email: "tanvir.ahmed@example.com",
      membership: {
        create: {
          membershipCode: "MEM-000001",
          barcodeNumber: "8801811223344",
          tierId: silverTier.id,
          pointsBalance: 120,
          totalPointsEarned: 150,
          totalSpend: 15000.0,
        },
      },
    },
  });

  console.log(`✅ Seeded Demo Member: Tanvir Ahmed (MEM-000001, Phone: +8801811223344, Points: 120)`);
  console.log("🎉 Database Seeding Completed Successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

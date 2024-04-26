const { PrismaClient } = require("@prisma/client");
const db = new PrismaClient();

async function main() {
  try {
    await db.category.createMany({
      data: [
        { name: "Web Development" },
        { name: "Mobile Development" },
        { name: "Data Science" },
        { name: "Machine Learning" },
        { name: "Artificial Intelligence" },
        { name: "Cybersecurity" },
        { name: "Game Development" },
        { name: "DevOps" },
        { name: "Cloud Computing" },
        { name: "Blockchain" },
        { name: "Internet of Things" },
        { name: "Augmented Reality" },
        { name: "Virtual Reality" },
        { name: "Quantum Computing" },
        { name: "Digital Marketing" },
        { name: "UI/UX Design" },
        { name: "Product Management" },
        { name: "Project Management" },
        { name: "Quality Assurance" },
        { name: "Business Analysis" },
        { name: "Sales" },
      ],
    });
    console.log("success");
  } catch (error) {
    console.error("Error seeding database categories");
  } finally {
  }
}

main();

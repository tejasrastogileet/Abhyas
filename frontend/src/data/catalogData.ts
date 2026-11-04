// Static catalog data for all catalog pages
import { BRAND_NAME } from "../config/brand";

export interface CatalogCourse {
  id: string
  courseName: string
  price: string | number
  rating: number
  ratingCount: number
  instructor: string
  thumbnail?: string
  comingSoon?: boolean
}

export interface CatalogPageData {
  pageTitle: string
  subheading: string
  description: string
  courses: CatalogCourse[]
}

// Placeholder image
const PLACEHOLDER_IMAGE = "https://via.placeholder.com/400x300?text=Course+Coming+Soon"

export const catalogData: Record<string, CatalogPageData> = {
  webdevelopment: {
    pageTitle: "Web Development",
    subheading: "Develop and bug off",
    description: "Master the art of building modern, responsive websites and web applications with HTML, CSS, JavaScript, and popular frameworks like React and Vue.js.",
    courses: [
      {
        id: "web-001",
        courseName: "Web Development Basics",
        price: "Free",
        rating: 4,
        ratingCount: 1,
        instructor: `${BRAND_NAME} Team`,
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "web-002",
        courseName: "MERN Stack",
        price: 5000,
        rating: 0,
        ratingCount: 0,
        instructor: "Expert Instructor",
        thumbnail: PLACEHOLDER_IMAGE,
        comingSoon: true,
      },
      {
        id: "web-003",
        courseName: "Advanced React",
        price: 3500,
        rating: 4.5,
        ratingCount: 12,
        instructor: "React Expert",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "web-004",
        courseName: "Next.js Mastery",
        price: 4000,
        rating: 4.8,
        ratingCount: 25,
        instructor: "Next.js Specialist",
        thumbnail: PLACEHOLDER_IMAGE,
      },
    ],
  },
  cpp: {
    pageTitle: "C++",
    subheading: "Master the power of systems programming",
    description: "Master problem-solving and system programming with C++. Learn object-oriented programming, data structures, and build high-performance applications.",
    courses: [
      {
        id: "cpp-001",
        courseName: "C++ Fundamentals",
        price: "Free",
        rating: 4.2,
        ratingCount: 45,
        instructor: "Programming Expert",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "cpp-002",
        courseName: "Data Structures in C++",
        price: 3000,
        rating: 4.7,
        ratingCount: 32,
        instructor: "Data Structures Master",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "cpp-003",
        courseName: "Competitive Programming",
        price: 2500,
        rating: 4.5,
        ratingCount: 28,
        instructor: "Competitive Coder",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "cpp-004",
        courseName: "Game Development with C++",
        price: 4500,
        rating: 0,
        ratingCount: 0,
        instructor: "Game Dev Expert",
        thumbnail: PLACEHOLDER_IMAGE,
        comingSoon: true,
      },
    ],
  },
  devops: {
    pageTitle: "DevOps",
    subheading: "Automate, deploy, and scale",
    description: "Learn CI/CD, cloud infrastructure, containerization, and automation tools. Master Docker, Kubernetes, Jenkins, and cloud platforms like AWS and Azure.",
    courses: [
      {
        id: "devops-001",
        courseName: "Docker Fundamentals",
        price: "Free",
        rating: 4.6,
        ratingCount: 67,
        instructor: "Container Expert",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "devops-002",
        courseName: "Kubernetes Mastery",
        price: 3500,
        rating: 4.8,
        ratingCount: 43,
        instructor: "Kubernetes Specialist",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "devops-003",
        courseName: "CI/CD with Jenkins",
        price: 3000,
        rating: 4.4,
        ratingCount: 22,
        instructor: "DevOps Engineer",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "devops-004",
        courseName: "AWS for DevOps",
        price: 4000,
        rating: 4.7,
        ratingCount: 55,
        instructor: "Cloud Architect",
        thumbnail: PLACEHOLDER_IMAGE,
      },
    ],
  },
  "web-designing": {
    pageTitle: "Web Designing",
    subheading: "Create stunning user experiences",
    description: "Design beautiful and user-friendly websites with Figma, Adobe XD, and modern design principles. Learn UX/UI design, typography, and responsive design.",
    courses: [
      {
        id: "design-001",
        courseName: "UI/UX Design Basics",
        price: "Free",
        rating: 4.5,
        ratingCount: 38,
        instructor: "Design Master",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "design-002",
        courseName: "Figma for Designers",
        price: 2500,
        rating: 4.7,
        ratingCount: 29,
        instructor: "Figma Expert",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "design-003",
        courseName: "Web Design Principles",
        price: 3000,
        rating: 4.3,
        ratingCount: 19,
        instructor: "Design Strategist",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "design-004",
        courseName: "Advanced Prototyping",
        price: 3500,
        rating: 0,
        ratingCount: 0,
        instructor: "Design Innovator",
        thumbnail: PLACEHOLDER_IMAGE,
        comingSoon: true,
      },
    ],
  },
  "machine-learning": {
    pageTitle: "Machine Learning",
    subheading: "Build intelligent systems",
    description: "Build intelligent systems with data. Learn Python, TensorFlow, scikit-learn, deep learning, and real-world ML applications.",
    courses: [
      {
        id: "ml-001",
        courseName: "Python for ML",
        price: "Free",
        rating: 4.6,
        ratingCount: 89,
        instructor: "ML Expert",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "ml-002",
        courseName: "Supervised Learning",
        price: 3500,
        rating: 4.8,
        ratingCount: 56,
        instructor: "ML Researcher",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "ml-003",
        courseName: "Deep Learning with TensorFlow",
        price: 4500,
        rating: 4.7,
        ratingCount: 42,
        instructor: "Deep Learning Specialist",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "ml-004",
        courseName: "Computer Vision Mastery",
        price: 4000,
        rating: 0,
        ratingCount: 0,
        instructor: "CV Expert",
        thumbnail: PLACEHOLDER_IMAGE,
        comingSoon: true,
      },
    ],
  },
  "block-chain": {
    pageTitle: "Block Chain",
    subheading: "Build decentralized applications",
    description: "Learn decentralized app development with blockchain technology. Master Ethereum, Solidity, Web3, and smart contracts.",
    courses: [
      {
        id: "blockchain-001",
        courseName: "Blockchain Fundamentals",
        price: "Free",
        rating: 4.4,
        ratingCount: 28,
        instructor: "Blockchain Pioneer",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "blockchain-002",
        courseName: "Solidity Smart Contracts",
        price: 3500,
        rating: 4.6,
        ratingCount: 34,
        instructor: "Smart Contract Expert",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "blockchain-003",
        courseName: "DeFi Development",
        price: 4000,
        rating: 4.5,
        ratingCount: 21,
        instructor: "DeFi Specialist",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "blockchain-004",
        courseName: "NFT & Web3 Ecosystem",
        price: 3000,
        rating: 0,
        ratingCount: 0,
        instructor: "Web3 Architect",
        thumbnail: PLACEHOLDER_IMAGE,
        comingSoon: true,
      },
    ],
  },
  "cyber-security": {
    pageTitle: "Cyber Security",
    subheading: "Protect systems and secure data",
    description: "Secure systems and protect data. Learn network security, ethical hacking, penetration testing, and cybersecurity best practices.",
    courses: [
      {
        id: "security-001",
        courseName: "Cybersecurity Fundamentals",
        price: "Free",
        rating: 4.7,
        ratingCount: 52,
        instructor: "Security Expert",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "security-002",
        courseName: "Ethical Hacking Basics",
        price: 3500,
        rating: 4.8,
        ratingCount: 41,
        instructor: "Ethical Hacker",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "security-003",
        courseName: "Penetration Testing",
        price: 4500,
        rating: 4.6,
        ratingCount: 25,
        instructor: "PenTest Professional",
        thumbnail: PLACEHOLDER_IMAGE,
      },
      {
        id: "security-004",
        courseName: "Cloud Security Mastery",
        price: 4000,
        rating: 0,
        ratingCount: 0,
        instructor: "Cloud Security Expert",
        thumbnail: PLACEHOLDER_IMAGE,
        comingSoon: true,
      },
    ],
  },
}

export const getCatalogData = (catalogName: string): CatalogPageData | null => {
  return catalogData[catalogName] || null
}

export const getAllCatalogNames = () => {
  return Object.keys(catalogData)
}

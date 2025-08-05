import { Product } from "../context/CartContext";

export interface Category {
  id: string;
  name: string;
  icon: string;
  gradient: string;
}

export interface Vendor {
  id: number;
  name: string;
  avatar: string;
  city: string;
  specialty: string;
  rating: number;
  gradient: string;
}

export const categories: Category[] = [
  {
    id: "vegetables",
    name: "Vegetables",
    icon: "🥬",
    gradient: "from-app-purple to-app-pink",
  },
  {
    id: "fruits",
    name: "Fruits",
    icon: "🍎",
    gradient: "from-app-sky to-app-purple",
  },
  {
    id: "clothes",
    name: "Clothes",
    icon: "👕",
    gradient: "from-app-pink to-app-sky",
  },
  {
    id: "medicine",
    name: "Medicine",
    icon: "💊",
    gradient: "from-app-purple to-app-sky",
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: "📱",
    gradient: "from-app-sky to-app-pink",
  },
];

export const vendors: Vendor[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    avatar:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=80&h=80&fit=crop&crop=face",
    city: "New York, USA",
    specialty: "Fruits & Vegetables",
    rating: 4.8,
    gradient: "from-app-purple to-app-sky",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
    city: "Brooklyn, NY",
    specialty: "Medicine & Health",
    rating: 4.9,
    gradient: "from-app-pink to-app-purple",
  },
  {
    id: 3,
    name: "Dr. Emma Wilson",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616c96c5263?w=80&h=80&fit=crop&crop=face",
    city: "Manhattan, NY",
    specialty: "Organic Foods",
    rating: 4.7,
    gradient: "from-app-sky to-app-pink",
  },
  {
    id: 4,
    name: "Dr. James Rodriguez",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
    city: "Queens, NY",
    specialty: "General Store",
    rating: 4.6,
    gradient: "from-app-purple to-app-sky",
  },
];

export const products: Product[] = [
  {
    id: 1,
    name: "Fresh Organic Tomatoes",
    price: 4.99,
    image:
      "https://images.unsplash.com/photo-1546470427-227b7ce4f34e?w=300&h=300&fit=crop&crop=center",
    category: "vegetables",
    vendor: {
      id: 1,
      name: "Dr. Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
      city: "New York, USA",
    },
    rating: 4.8,
    description: "Fresh organic tomatoes grown locally",
    inStock: true,
    unit: "Kg",
  },
  {
    id: 2,
    name: "Golden Apples",
    price: 3.50,
    image:
      "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300&h=300&fit=crop&crop=center",
    category: "fruits",
    vendor: {
      id: 1,
      name: "Dr. Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
      city: "New York, USA",
    },
    rating: 4.6,
    description: "Sweet and crispy golden apples",
    inStock: true,
    unit: "Kg",
  },
  {
    id: 3,
    name: "Artisan Bread",
    price: 2.80,
    image:
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop&crop=center",
    category: "food",
    vendor: {
      id: 2,
      name: "Dr. Michael Chen",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      city: "Brooklyn, NY",
    },
    rating: 4.9,
    description: "Freshly baked artisan bread",
    inStock: true,
    unit: "piece",
  },
  {
    id: 4,
    name: "Organic Bananas",
    price: 2.20,
    image:
      "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=300&h=300&fit=crop&crop=center",
    category: "fruits",
    vendor: {
      id: 3,
      name: "Dr. Emma Wilson",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616c96c5263?w=40&h=40&fit=crop&crop=face",
      city: "Manhattan, NY",
    },
    rating: 4.7,
    description: "Organic bananas packed with nutrients",
    inStock: true,
    unit: "Kg",
  },
  {
    id: 5,
    name: "Fresh Milk",
    price: 1.85,
    image:
      "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop&crop=center",
    category: "dairy",
    vendor: {
      id: 4,
      name: "Dr. James Rodriguez",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      city: "Queens, NY",
    },
    rating: 4.8,
    description: "Fresh whole milk from local farms",
    inStock: true,
    unit: "L",
  },
  {
    id: 6,
    name: "Farm Eggs",
    price: 4.20,
    image:
      "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?w=300&h=300&fit=crop&crop=center",
    category: "dairy",
    vendor: {
      id: 1,
      name: "Dr. Sarah Johnson",
      avatar:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=40&h=40&fit=crop&crop=face",
      city: "New York, USA",
    },
    rating: 4.9,
    description: "Fresh farm eggs from free-range chickens",
    inStock: true,
    unit: "dozen",
  },
];

export const cities = ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"];

export const statisticsData = {
  familiesHelped: "500+",
  partnerVendors: "50+",
  donationsCompleted: "1000+",
  totalAmountDonated: "€25k+"
};

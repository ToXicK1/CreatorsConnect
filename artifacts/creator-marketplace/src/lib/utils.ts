import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatFollowers(count: number): string {
  if (count >= 10000000) return `${(count / 10000000).toFixed(1)} Cr`;
  if (count >= 100000) return `${(count / 100000).toFixed(1)}L`;
  if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
  return count.toString();
}

export function formatINR(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

export const CATEGORIES = [
  "Fashion & Style", "Tech & Gaming", "Food & Travel", "Health & Fitness",
  "Beauty & Skincare", "Finance & Business", "Entertainment", "Education & Career",
  "Lifestyle", "Comedy", "Sports", "Devotional",
];

export const LANGUAGES = [
  "Hindi", "English", "Tamil", "Telugu", "Bengali", "Marathi",
  "Gujarati", "Kannada", "Malayalam", "Punjabi", "Odia", "Urdu",
];

export const PLATFORMS = ["instagram", "youtube", "twitter", "linkedin", "moj", "sharechat", "josh", "snapchat"];

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export const PLATFORM_COLORS: Record<string, string> = {
  instagram: "bg-pink-100 text-pink-700",
  youtube: "bg-red-100 text-red-700",
  twitter: "bg-sky-100 text-sky-700",
  linkedin: "bg-blue-100 text-blue-700",
  moj: "bg-purple-100 text-purple-700",
  sharechat: "bg-yellow-100 text-yellow-700",
  josh: "bg-orange-100 text-orange-700",
  snapchat: "bg-yellow-200 text-yellow-700",
};

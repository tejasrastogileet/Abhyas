export const normalizeCategorySlug = (value: string): string => {
  let decodedValue = value;
  try {
    decodedValue = decodeURIComponent(value);
  } catch {
    // Keep malformed URL input as-is and normalize the remaining characters.
  }

  return decodedValue.toLowerCase().replace(/\+/g, "p").replace(/[^a-z0-9]/g, "");
};

interface SluggableCategory {
  _id: string;
  name: string;
}

export const getCategoryHref = (
  category: SluggableCategory,
  categories: SluggableCategory[],
): string => {
  const slug = normalizeCategorySlug(category.name);
  const hasCollision = categories.filter((item) => normalizeCategorySlug(item.name) === slug).length > 1;
  return `/catalog/${slug}${hasCollision ? `?categoryId=${encodeURIComponent(category._id)}` : ""}`;
};
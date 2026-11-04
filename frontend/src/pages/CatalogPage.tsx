import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import Course_Card from "../components/core/Catalog/Course_Card";
import Footer from "../components/common/Footer";
import { useCourseCategories } from "../hooks/useCourseCategories";
import { getCatalogPageData } from "../services/operations/pageAndComponentData";
import { getCategoryHref, normalizeCategorySlug } from "../utils/catalogSlug";

function CatalogPage() {
  const { catalogName = "" } = useParams<{ catalogName: string }>();
  const [searchParams] = useSearchParams();
  const requestedCategoryId = searchParams.get("categoryId");
  const { categories, loading: categoriesLoading, error: categoriesError, retry: retryCategories } = useCourseCategories();
  const [pageData, setPageData] = useState<any>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [retryAttempt, setRetryAttempt] = useState(0);
  const normalizedSlug = normalizeCategorySlug(catalogName);
  const matchingCategories = categories.filter((item) => normalizeCategorySlug(item.name) === normalizedSlug);
  const category = requestedCategoryId
    ? matchingCategories.find((item) => item._id === requestedCategoryId)
    : matchingCategories.find((item) => item.name === "C++") || matchingCategories[0];

  useEffect(() => {
    if (categoriesLoading || categoriesError || !category) return;

    let active = true;
    setDetailsLoading(true);
    setDetailsError("");
    setPageData(null);

    getCatalogPageData(category._id)
      .then((result) => {
        if (active) setPageData(result);
      })
      .catch((error) => {
        if (active) setDetailsError(error?.message || "Could not load this category.");
      })
      .finally(() => {
        if (active) setDetailsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [category?._id, categoriesLoading, categoriesError, retryAttempt]);

  const retryDetails = () => setRetryAttempt((attempt) => attempt + 1);
  const buttonClass = "rounded-md bg-yellow-25 px-5 py-2 font-semibold text-richblack-900 hover:bg-yellow-50";

  if (categoriesLoading || detailsLoading) {
    return (
      <main className="mx-auto min-h-screen w-11/12 max-w-maxContent py-16" aria-label="Loading category">
        <div className="mb-10 h-40 animate-pulse rounded-lg bg-richblack-700" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="h-72 animate-pulse rounded-lg bg-richblack-700" />
          ))}
        </div>
      </main>
    );
  }

  if (categoriesError) {
    return (
      <main className="grid min-h-[60vh] place-items-center px-6 text-center text-richblack-5">
        <div><p className="mb-4">{categoriesError}</p><button className={buttonClass} onClick={retryCategories}>Retry</button></div>
      </main>
    );
  }

  if (!category) {
    return (
      <main className="mx-auto grid min-h-[60vh] w-11/12 max-w-maxContent place-items-center py-16 text-center text-richblack-5">
        <div>
          <h1 className="mb-3 text-3xl font-semibold">Category not found</h1>
          <p className="mb-6 text-richblack-200">Choose a category from the catalog.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((item) => (
              <Link className={buttonClass} key={item._id} to={getCategoryHref(item, categories)}>{item.name}</Link>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (detailsError) {
    return (
      <main className="grid min-h-[60vh] place-items-center px-6 text-center text-richblack-5">
        <div><p className="mb-4">{detailsError}</p><button className={buttonClass} onClick={retryDetails}>Retry</button></div>
      </main>
    );
  }

  const courses = pageData?.selectedCategory?.courses || [];

  return (
    <>
      <main className="min-h-[65vh]">
        <header className="bg-richblack-800 px-6 py-12 text-richblack-5">
          <div className="mx-auto w-11/12 max-w-maxContent">
            <p className="mb-3 text-sm text-richblack-300">Home / Catalog / {category.name}</p>
            <h1 className="mb-3 text-3xl font-semibold">{category.name}</h1>
            <p className="max-w-3xl text-richblack-200">{pageData?.selectedCategory?.description || category.description}</p>
          </div>
        </header>
        <section className="mx-auto w-11/12 max-w-maxContent py-12">
          {courses.length === 0 ? (
            <p className="py-16 text-center text-xl text-richblack-200">No courses yet</p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => <Course_Card key={course._id} course={course} Height="h-[220px]" />)}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}

export default CatalogPage

import React from 'react'
// import { toast } from "react-hot-toast"
import { apiConnector } from '../apiConnector';
import { catalogData as catalogEndpoints } from '../apis';


// ================ get Catalog Page Data  ================
export const getCatalogPageData = async (categoryId) => {
  const response = await apiConnector("POST", catalogEndpoints.CATALOGPAGEDATA_API, { categoryId });
  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Could not fetch category page data.");
  }
  return response.data.data;
}


"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ActionResponse } from "@/types";

/**
 * Standard server-side error logger.
 */
function logError(action: string, error: any) {
  console.error(`[action:${action}] error:`, {
    message: error?.message || "Unknown error",
    stack: error?.stack,
    timestamp: new Date().toISOString(),
  });
}

// ── STATES ──────────────────────────────────────────────────────────────────

export async function getStates(): Promise<ActionResponse> {
  try {
    const states = await prisma.state.findMany({
      include: { cities: true },
      orderBy: { name: "asc" },
    });
    return { success: true, message: "States fetched successfully.", data: states };
  } catch (err: any) {
    logError("getStates", err);
    return { success: false, message: "Failed to fetch states.", error: err.message };
  }
}

export async function createState(data: { name: string; slug: string }): Promise<ActionResponse> {
  try {
    const state = await prisma.state.create({ data });
    revalidatePath("/admin/destinations");
    revalidatePath("/destinations");
    return { success: true, message: "State created successfully.", data: state };
  } catch (err: any) {
    logError("createState", err);
    return { success: false, message: "Failed to create state.", error: err.message };
  }
}

// ── CITIES ──────────────────────────────────────────────────────────────────

export async function getCities(): Promise<ActionResponse> {
  try {
    const cities = await prisma.city.findMany({
      include: { state: true },
      orderBy: { name: "asc" },
    });
    return { success: true, message: "Cities fetched successfully.", data: cities };
  } catch (err: any) {
    logError("getCities", err);
    return { success: false, message: "Failed to fetch cities.", error: err.message };
  }
}

export async function getCityBySlug(slug: string): Promise<ActionResponse> {
  try {
    const city = await prisma.city.findUnique({
      where: { slug },
      include: { 
        state: true, 
        blogs: { where: { published: true }, orderBy: { createdAt: "desc" } } 
      }
    });
    if (!city) return { success: false, message: "City not found." };
    return { success: true, message: "City fetched successfully.", data: city };
  } catch (err: any) {
    logError("getCityBySlug", err);
    return { success: false, message: "Failed to fetch city details.", error: err.message };
  }
}

export async function createCity(data: any): Promise<ActionResponse> {
  try {
    const city = await prisma.city.create({ data });
    revalidatePath("/admin/destinations");
    revalidatePath("/destinations");
    return { success: true, message: "City created successfully.", data: city };
  } catch (err: any) {
    logError("createCity", err);
    return { success: false, message: "Failed to create city.", error: err.message };
  }
}

export async function updateCityFeatured(id: string, featured: boolean): Promise<ActionResponse> {
  try {
    const city = await prisma.city.update({
      where: { id },
      data: { featured },
    });
    revalidatePath("/admin/destinations");
    revalidatePath("/destinations");
    return { success: true, message: `City ${featured ? 'featured' : 'unfeatured'} successfully.`, data: city };
  } catch (err: any) {
    logError("updateCityFeatured", err);
    return { success: false, message: "Failed to update city status.", error: err.message };
  }
}

export async function deleteCity(id: string): Promise<ActionResponse> {
  try {
    await prisma.city.delete({ where: { id } });
    revalidatePath("/admin/destinations");
    revalidatePath("/destinations");
    return { success: true, message: "City deleted successfully." };
  } catch (err: any) {
    logError("deleteCity", err);
    return { success: false, message: "Failed to delete city.", error: err.message };
  }
}

// ── BLOGS ──────────────────────────────────────────────────────────────────

export async function getBlogs(): Promise<ActionResponse> {
  try {
    const blogs = await prisma.blog.findMany({
      include: { city: true },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, message: "Blogs fetched successfully.", data: blogs };
  } catch (err: any) {
    logError("getBlogs", err);
    return { success: false, message: "Failed to fetch blogs.", error: err.message };
  }
}

export async function getCityBlogsForPublic(cityName: string): Promise<ActionResponse> {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        published: true,
        city: { name: cityName },
      },
      orderBy: { createdAt: "desc" },
      take: 6,
    });
    return { success: true, message: "City blogs fetched successfully.", data: blogs };
  } catch (err: any) {
    logError("getCityBlogsForPublic", err);
    return { success: false, message: "Failed to fetch city blogs.", error: err.message };
  }
}

export async function createBlog(data: any): Promise<ActionResponse> {
  try {
    const blog = await prisma.blog.create({ data });
    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    if (data.cityId) revalidatePath(`/destinations/${blog.cityId}`);
    return { success: true, message: "Blog created successfully.", data: blog };
  } catch (err: any) {
    logError("createBlog", err);
    return { success: false, message: "Failed to create blog post.", error: err.message };
  }
}

export async function updateBlogStatus(id: string, published: boolean): Promise<ActionResponse> {
  try {
    const blog = await prisma.blog.update({
      where: { id },
      data: { published },
    });
    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    return { success: true, message: `Blog ${published ? 'published' : 'unpublished'} successfully.`, data: blog };
  } catch (err: any) {
    logError("updateBlogStatus", err);
    return { success: false, message: "Failed to update blog status.", error: err.message };
  }
}

export async function deleteBlog(id: string): Promise<ActionResponse> {
  try {
    await prisma.blog.delete({ where: { id } });
    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    return { success: true, message: "Blog post deleted successfully." };
  } catch (err: any) {
    logError("deleteBlog", err);
    return { success: false, message: "Failed to delete blog post.", error: err.message };
  }
}

export async function updateBlog(id: string, data: any): Promise<ActionResponse> {
  try {
    const blog = await prisma.blog.update({
      where: { id },
      data,
    });
    revalidatePath("/admin/blogs");
    revalidatePath("/blog");
    revalidatePath(`/blog/${blog.slug}`);
    return { success: true, message: "Blog updated successfully.", data: blog };
  } catch (err: any) {
    logError("updateBlog", err);
    return { success: false, message: "Failed to update blog post.", error: err.message };
  }
}


"use client";
import { useEffect } from "react";

export function ViewTracker({ propertyId }: { propertyId: number }) {
  useEffect(() => {
    const api = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    fetch(`${api}/properties/${propertyId}/view`, { method: "POST", cache: "no-store" }).catch(console.error);
  }, [propertyId]);
  return null;
}

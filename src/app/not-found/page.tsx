"use client";

import { NotFoundContent } from "@/components/ui/NotFoundContent";
import { useEffect } from "react";
import { useProductStore } from "@/store/useProductStore";

export default function NotFoundPage() {
  const setLoading = useProductStore((state) => state.setLoading);

  useEffect(() => {
    // Al entrar a la página real, nos aseguramos de apagar el spinner
    setLoading(false);
    document.body.style.cursor = 'default';
  }, [setLoading]);

  return <NotFoundContent />;
}
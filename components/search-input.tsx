"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export const SearchInput = () => {
  const [value, setValue] = useState<string>("");
  const debouncedValue = useDebounce(value, 500);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debouncedValue, currentCategoryId, pathname, router]);
  return (
    <>
      <div className="relative">
        <SearchIcon className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
        <Input
          onChange={(e) => setValue(e.target.value)}
          placeholder="Search for a course"
          className="w-full md:w-72 pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        />
      </div>
    </>
  );
};

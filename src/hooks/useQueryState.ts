import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import debounce from "lodash.debounce";

type QueryStateOptions<T> = {
  key: string;
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string | null) => T;
  debounceTime?: number; // Optional debounce time in milliseconds
};

export function useQueryState<T>({
  key,
  defaultValue,
  serialize = (value) => String(value),
  deserialize = (value) => (value ? (value as unknown as T) : defaultValue),
  debounceTime = 300, // Default debounce time: 300ms
}: QueryStateOptions<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // Initialize state from query param or default value
  const initialValue = searchParams.get(key)
    ? deserialize(searchParams.get(key))
    : defaultValue;
  const [value, setValue] = useState<T>(initialValue);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  // Debounced function to update URL
  const updateQueryParam = useCallback(
    debounce((queryValue: string | null) => {
      const newSearchParams = new URLSearchParams(searchParams.toString());
      if (queryValue === null || queryValue === "") {
        newSearchParams.delete(key);
      } else {
        newSearchParams.set(key, queryValue);
      }
      router.replace(`${pathname}?${newSearchParams.toString()}`, {
        scroll: false,
      });
    }, debounceTime),
    [key, pathname, router, searchParams, debounceTime]
  );

  // Update URL when pendingQuery changes
  useEffect(() => {
    if (pendingQuery !== null) {
      updateQueryParam(pendingQuery);
    }
  }, [pendingQuery, updateQueryParam]);

  // Sync state with URL changes
  useEffect(() => {
    const queryValue = searchParams.get(key);
    const newValue = queryValue ? deserialize(queryValue) : defaultValue;
    setValue(newValue);
  }, [key, searchParams, defaultValue, deserialize]);

  // Update state and queue URL update
  const setQueryState = useCallback(
    (newValue: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolvedValue =
          typeof newValue === "function"
            ? (newValue as (prev: T) => T)(prev)
            : newValue;
        setPendingQuery(
          resolvedValue === defaultValue ? "" : serialize(resolvedValue)
        );
        return resolvedValue;
      });
    },
    [defaultValue, serialize]
  );

  useEffect(() => {
    return () => {
      updateQueryParam.cancel();
    };
  }, [updateQueryParam]);

  return [value, setQueryState] as const;
}

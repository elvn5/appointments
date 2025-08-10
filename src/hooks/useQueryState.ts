import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import debounce from "lodash.debounce";

type QueryStateOptions<T> = {
  key: string;
  defaultValue: T;
  serialize?: (value: T) => string;
  deserialize?: (value: string | null) => T;
  debounceTime?: number;
};

export function useQueryState<T>({
  key,
  defaultValue,
  serialize = (value) => String(value),
  deserialize = (value) => (value ? (value as unknown as T) : defaultValue),
  debounceTime = 300,
}: QueryStateOptions<T>) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const initialValue = searchParams.get(key)
    ? deserialize(searchParams.get(key))
    : defaultValue;
  const [value, setValue] = useState<T>(initialValue);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

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

  useEffect(() => {
    if (pendingQuery !== null) {
      updateQueryParam(pendingQuery);
    }
  }, [pendingQuery, updateQueryParam]);

  useEffect(() => {
    const queryValue = searchParams.get(key);
    const newValue = queryValue ? deserialize(queryValue) : defaultValue;
    setValue(newValue);
  }, [key, searchParams, defaultValue, deserialize]);

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

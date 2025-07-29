import { useState, useEffect } from "react";
import { AccessInfo } from "../types";

export function useFetchAccessInfo(dataset_id: number) {
  const [accessInfo, setAccessInfo] = useState<AccessInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAccessInfo = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/access_info/${dataset_id}`);
        const data = await response.json();
        setAccessInfo(data);
      } catch (error) {
        console.error("Error fetching access info:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAccessInfo();
  }, [dataset_id]);
  
  return { accessInfo, isLoading };
}

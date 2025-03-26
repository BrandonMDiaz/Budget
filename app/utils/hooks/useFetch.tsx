import { useState } from "react";

export function useFetch() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const POST = async (url: string, data: any) => {
    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };
  const PUT = () => {};
  const DELETE = () => {};
}

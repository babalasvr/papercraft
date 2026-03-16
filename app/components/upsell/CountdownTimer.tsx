"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clock } from "lucide-react";

interface CountdownTimerProps {
  minutes?: number;
  redirectTo?: string;
}

export default function CountdownTimer({
  minutes = 10,
  redirectTo = "/obrigado",
}: CountdownTimerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [timeLeft, setTimeLeft] = useState(minutes * 60);

  const buildUrl = useCallback(
    (path: string) => {
      const orderId = searchParams.get("order_id");
      return orderId ? `${path}?order_id=${orderId}` : path;
    },
    [searchParams]
  );

  useEffect(() => {
    if (timeLeft <= 0) {
      router.push(buildUrl(redirectTo));
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, router, redirectTo, buildUrl]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const isUrgent = timeLeft <= 120;

  return (
    <div
      className={`flex items-center justify-center gap-2 text-sm font-bold transition-colors ${
        isUrgent ? "text-red-600" : "text-[#3D2B1F]"
      }`}
    >
      <Clock className={`w-4 h-4 ${isUrgent ? "animate-pulse" : ""}`} />
      <span>
        Oferta expira em{" "}
        <span className="font-mono tabular-nums">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
      </span>
    </div>
  );
}

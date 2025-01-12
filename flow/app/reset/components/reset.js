import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyPasswordReset } from "@/app/lib/api";

export default function VerifyPasswordReset() {
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  useEffect(() => {
    const verifyToken = async () => {
      try {
        await verifyPasswordReset(uid, token);
        setVerified(true);
      } catch (err) {
        setError("Invalid or expired reset link.");
      }
    };
    verifyToken();
  }, [uid, token]);

  if (error) return <p>{error}</p>;
  if (!verified) return <p>Verifying reset link...</p>;

  router.push(`/reset-password?uid=${uid}&token=${token}`);
}

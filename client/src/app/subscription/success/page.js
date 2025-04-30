"use client";

import { capturePaypalOrder } from "@/services/subscription-service";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react"; // Import Suspense

// This is the component that uses useSearchParams
function SubscriptionSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const orderId = searchParams.get("token");

    const processPayment = async () => {
      try {
        const response = await capturePaypalOrder(orderId);

        if (response.success) {
          // Use router.replace to avoid adding to history
          router.replace("/");
        } else {
           // Handle potential errors from capturePaypalOrder better
           console.error("Payment capture failed:", response.error); // Log the error
           setStatus("error");
        }
      } catch (e) {
        console.error("An error occurred during payment processing:", e); // Log the exception
        setStatus("error");
      }
    };

    // Ensure orderId is available before processing
    if (orderId) {
      processPayment();
    } else {
      // Handle cases where 'token' search param is missing
      console.warn("Missing 'token' search parameter.");
      setStatus("error"); // Or redirect to an error page
    }

  }, [searchParams, router]); // Added router to the dependency array

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-lg">
        {status === "processing" && (
          <div className="flex flex-col items-center text-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary mb-4" />
            <h1 className="text-2xl font-bold mb-2">Processing Payment</h1>
            <p className="text-muted-foreground mb-4">
              Please wait while we confirm your payment
            </p>
          </div>
        )}
        {status === "error" && (
           <div className="flex flex-col items-center text-center text-red-500">
             <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
             <p className="text-muted-foreground mb-4">
               There was an error processing your payment. Please try again or contact support.
             </p>
             {/* Optionally add a button to go back home or retry */}
           </div>
        )}
      </div>
    </div>
  );
}

// Wrap the component in a Suspense boundary
function SubscriptionSuccessPage() {
  return (
    <Suspense fallback={<div>Loading payment details...</div>}>
      <SubscriptionSuccessContent />
    </Suspense>
  );
}

export default SubscriptionSuccessPage;
"use client";
/**
 * components/resume/PrintButton.tsx — client-only print trigger
 */
import { Printer } from "lucide-react";
import { MotionButton } from "@/components/ui/Button";

export function PrintButton() {
  return (
    <MotionButton
      variant="secondary"
      leftIcon={<Printer size={15} />}
      onClick={() => window.print()}
    >
      Print
    </MotionButton>
  );
}

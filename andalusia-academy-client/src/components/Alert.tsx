import type { ReactNode } from "react";
import "./Alert.css";

interface AlertProps {
  tone: "error" | "success";
  children: ReactNode;
}

export default function Alert({ tone, children }: AlertProps) {
  return (
    <div className={`alert alert--${tone}`} role={tone === "error" ? "alert" : "status"}>
      {children}
    </div>
  );
}

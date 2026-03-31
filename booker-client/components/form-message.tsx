import React from "react";

export type Message =
  | {
      success?: string;
      error?: string;
      message?: string;
      [key: string]: string | undefined;
    }
  | undefined;

const getMessageText = (
  message?: Message,
): { type: "success" | "error" | "info"; text: string } | null => {
  if (!message) return null;

  if (typeof message.success === "string" && message.success.length > 0) {
    return { type: "success", text: message.success };
  }

  if (typeof message.error === "string" && message.error.length > 0) {
    return { type: "error", text: message.error };
  }

  if (typeof message.message === "string" && message.message.length > 0) {
    return { type: "info", text: message.message };
  }

  for (const value of Object.values(message)) {
    if (typeof value === "string" && value.length > 0) {
      return { type: "info", text: value };
    }
  }

  return null;
};

export const FormMessage = ({ message }: { message?: Message }) => {
  const parsed = getMessageText(message);

  if (!parsed) return null;

  const colorClass =
    parsed.type === "success"
      ? "text-green-600"
      : parsed.type === "error"
        ? "text-red-600"
        : "text-foreground/80";

  return (
    <p className={`text-sm ${colorClass}`} role="status" aria-live="polite">
      {parsed.text}
    </p>
  );
};

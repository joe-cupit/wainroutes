"use client";

import buttonStyles from "@/styles/buttons.module.css";

export default function BackButton() {
  return (
    <button
      onClick={() => history.back()}
      className={`${buttonStyles.button} ${buttonStyles.primary} ${buttonStyles.small}`}
    >
      Go back
    </button>
  );
}

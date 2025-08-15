"use client";

import buttonStyles from "@/app/buttons.module.css";


export default function BackButton() {
  return (
    <button
      onClick={() => history.back()}
      className={`${buttonStyles.button} ${buttonStyles.primary}`}
    >
      Go back
    </button>
  )
}
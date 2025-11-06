function GoogleIcon({ d }: { d: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      viewBox="0 -960 960 960"
      height="24px"
      width="24px"
    >
      <path d={d} />
    </svg>
  );
}

export function LeftIcon() {
  return <GoogleIcon d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" />;
}

export function RightIcon() {
  return <GoogleIcon d="m321-80-71-71 329-329-329-329 71-71 400 400L321-80Z" />;
}

export function DropdownIcon() {
  return <GoogleIcon d="M480-360 280-560h400L480-360Z" />;
}

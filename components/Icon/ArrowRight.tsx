import { SVGAttributes } from 'react';

interface ArrowRightProps extends SVGAttributes<HTMLOrSVGElement> {}

export function ArrowRight(props: ArrowRightProps) {
  return (
    <svg
      width={8}
      height={14}
      viewBox="0 0 8 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.172 7L.222 2.05 1.636.636 8 7l-6.364 6.364L.222 11.95 5.172 7z"
        fill="currentColor"
      />
    </svg>
  )
}


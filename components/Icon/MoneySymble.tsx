import { SVGAttributes } from 'react';

interface MoneySymbleSvgProps extends SVGAttributes<HTMLOrSVGElement> {}

export function MoneySymbleSvg(props: MoneySymbleSvgProps) {
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16.001A8 8 0 0010 18zm-3.5-6H12a.5.5 0 000-1H8a2.5 2.5 0 010-5h1V4h2v2h2.5v2H8a.5.5 0 100 1h4a2.5 2.5 0 010 5h-1v2H9v-2H6.5v-2z"
        fill="currentColor"
      />
    </svg>
  )
}



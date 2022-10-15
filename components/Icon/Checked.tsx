import { SVGAttributes } from 'react';

interface CheckedSvgProps extends SVGAttributes<HTMLOrSVGElement> {}

export function CheckedSvg(props: CheckedSvgProps) {
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
        d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm-.997-6l7.07-7.071-1.414-1.414-5.656 5.657-2.829-2.829L4.76 9.757 9.003 14z"
        fill="currentColor"
      />
    </svg>
  )
}


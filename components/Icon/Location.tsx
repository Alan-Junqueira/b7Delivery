import { SVGAttributes } from 'react';

interface LocationProps extends SVGAttributes<HTMLOrSVGElement> {}

export function Location(props: LocationProps) {
  return (
    <svg
      width={18}
      height={22}
      viewBox="0 0 18 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9 18.9l4.95-4.95a7 7 0 10-9.9 0L9 18.9zm0 2.828l-6.364-6.364a9 9 0 1112.728 0L9 21.728zM9 11a2 2 0 100-4 2 2 0 000 4zm0 2a4 4 0 110-8 4 4 0 010 8z"
        fill="currentColor"
      />
    </svg>
  )
}
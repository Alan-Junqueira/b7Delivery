import { SVGAttributes } from 'react';

interface DescountSvgProps extends SVGAttributes<HTMLOrSVGElement> {}

export function DescountSvg(props: DescountSvgProps) {
  return (
    <svg
      width={20}
      height={18}
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M0 1a1 1 0 011-1h18a1 1 0 011 1v5.5a2.5 2.5 0 000 5V17a1 1 0 01-1 1H1a1 1 0 01-1-1V1zm6.085 15a1.5 1.5 0 012.83 0H18v-2.968a4.5 4.5 0 010-8.064V2H8.915a1.5 1.5 0 01-2.83 0H2v14h4.085zM7.5 8a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm0 5a1.5 1.5 0 110-3 1.5 1.5 0 010 3z"
        fill="currentColor"
      />
    </svg>
  )
}


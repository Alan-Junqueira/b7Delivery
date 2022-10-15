import { SVGAttributes } from 'react';

interface CardSymbleSvgProps extends SVGAttributes<HTMLOrSVGElement> {}

export function CardSymbleSvg(props: CardSymbleSvgProps) {
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
        d="M1 0h18a1 1 0 011 1v16a1 1 0 01-1 1H1a1 1 0 01-1-1V1a1 1 0 011-1zm17 8H2v8h16V8zm0-2V2H2v4h16zm-6 6h4v2h-4v-2z"
        fill="currentColor"
      />
    </svg>
  )
}

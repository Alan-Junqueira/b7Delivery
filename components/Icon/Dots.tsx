import { SVGAttributes } from 'react';

interface DescountSvgProps extends SVGAttributes<HTMLOrSVGElement> {}

const Dots = (props: DescountSvgProps) => {
  return (
    <svg
      width={4}
      height={18}
      viewBox="0 0 4 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2 0C.9 0 0 .9 0 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-7C.9 7 0 7.9 0 9s.9 2 2 2 2-.9 2-2-.9-2-2-2z"
        fill="currentColor"
      />
    </svg>
  );
};

export { Dots };

import { SVGAttributes } from "react";

interface IconProps extends SVGAttributes<SVGSVGElement> {
  name: string;
}

export const Icon = ({ name, ...props }: IconProps) => {
  return (
    <svg {...props}>
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
};

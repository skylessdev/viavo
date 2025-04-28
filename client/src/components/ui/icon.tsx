interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className = "" }: IconProps) {
  return (
    <span className={`material-icons-round ${className}`}>
      {name}
    </span>
  );
}

export default Icon;

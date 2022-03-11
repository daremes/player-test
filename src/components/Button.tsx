import classNames from "classnames";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { createUseStyles } from "react-jss";

interface ButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {}

const useStyles = createUseStyles({
  default: {
    border: "1px solid #fff",
    borderRadius: 4,
    padding: 4,
    cursor: "pointer",
  },
});

const Button = ({ children, ...rest }: ButtonProps) => {
  const classes = useStyles();
  return (
    <button {...rest} className={classNames(classes.default, rest.className)}>
      {children}
    </button>
  );
};

export default Button;

import { Oval } from "react-loader-spinner";
import css from "./Loader.module.css";

interface LoaderProps {
  fullHeight?: boolean;
}

export default function Loader({ fullHeight = false }: LoaderProps) {
  const rootClassName = [css.loader, fullHeight && css.fullHeight]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClassName}>
      <Oval
        visible={true}
        height="80"
        width="80"
        color="#CD5B45"
        secondaryColor="#FAD7A0"
        ariaLabel="oval-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}

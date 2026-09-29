import css from "./AuthNav.module.css";
import { AppLink } from "../../Ui/Button/Button";

interface AuthNavProps {
  isAuth: boolean;
  onNavigate?: () => void;
}

export default function AuthNav({ isAuth, onNavigate }: AuthNavProps) {
  return (
    <ul className={css.authNav}>
      {!isAuth ? (
        <>
          <li className={css.authLinkItem}>
            <AppLink
              href="/login"
              variant="secondary"
              className={css.authLink}
              onClick={onNavigate}
            >
              Вхід
            </AppLink>
          </li>
          <li className={css.authLinkItem}>
            <AppLink
              href="/register"
              variant="primary"
              className={css.authLink}
              onClick={onNavigate}
            >
              Реєстрація
            </AppLink>
          </li>
        </>
      ) : (
        <li className={css.authLinkItem}>
          <AppLink
            href="/locations/add"
            variant="primary"
            className={css.authLink}
            onClick={onNavigate}
          >
            Поділитись локацією
          </AppLink>
        </li>
      )}
    </ul>
  );
}

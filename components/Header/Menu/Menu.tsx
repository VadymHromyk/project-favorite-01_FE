import AuthNav from "../AuthNav/AuthNav";
import NavList from "../NavList/NavList";
import Profile from "../Profile/Profile";
import css from "./Menu.module.css";
import { User } from "@/types/auth";
import { AppLink } from "../../Ui/Button/Button";

interface MenuProps {
  user: User | null;
  isAuth: boolean;
  onNavigate?: () => void;
}

export default function Menu({ user, isAuth, onNavigate }: MenuProps) {
  return (
    <div className={css.menuWrapper}>
      <div className={css.container}>
        <NavList
          isAuth={isAuth}
          userId={user?.id ?? user?._id}
          onNavigate={onNavigate}
        />
        {isAuth ? (
          <div className={css.profileWrapper}>
            <AppLink
              href="/locations/add"
              variant="primary"
              className={css.authLink}
              onClick={onNavigate}
            >
              Поділитись локацією
            </AppLink>
            <Profile onNavigate={onNavigate} />
          </div>
        ) : (
          <div className={css.authNavWrapper}>
            <AuthNav isAuth={isAuth} onNavigate={onNavigate} />
          </div>
        )}
      </div>
    </div>
  );
}
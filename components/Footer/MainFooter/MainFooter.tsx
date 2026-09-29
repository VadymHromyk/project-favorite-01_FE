import Logo from "../../Header/Logo/Logo";
import Credits from "../Credits/Credits";
import NavLinks from "../NavLinks/NavLinks";
import SocialLinks from "../SocialLinks/SocialLinks";
import css from "./MainFooter.module.css";

export default function MainFooter() {
  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <div className={css.content}>
          <div className={css.brandColumn}>
            <Logo />
          </div>

          <SocialLinks />
          <NavLinks />
        </div>

        <Credits />
      </div>
    </footer>
  );
}

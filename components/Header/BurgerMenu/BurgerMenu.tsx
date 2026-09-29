import css from "./BurgerMenu.module.css";

interface BurgerMenuProps {
  isMenuOpen: boolean;
  handleMenuClick: () => void;
}

export default function BurgerMenu({
  isMenuOpen,
  handleMenuClick,
}: BurgerMenuProps) {
  return (
    <button
      type="button"
      onClick={handleMenuClick}
      className={css.menuButton}
      aria-expanded={isMenuOpen}
      aria-label={isMenuOpen ? "Закрити меню" : "Відкрити меню"}
    >
      <svg
        className={`${css.menuIconSvg} ${isMenuOpen ? css.hidden : css.visible}`}
      >
        <use className={css.menuIcon} href="/sprite.svg#menu" />
      </svg>

      <svg
        className={`${css.menuIconSvg} ${isMenuOpen ? css.visible : css.hidden}`}
      >
        <use className={css.menuIcon} href="/sprite.svg#close" />
      </svg>
    </button>
  );
}

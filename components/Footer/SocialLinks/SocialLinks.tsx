import Link from "next/link";
import { Icon } from "../../Ui/Icon/Icon";
import css from "./SocialLinks.module.css";

const socialLinks = [
  {
    href: "https://www.facebook.com",
    icon: "icon-Facebook",
    label: "Facebook",
  },
  { href: "https://www.instagram.com", icon: "Instagram", label: "Instagram" },
  { href: "https://x.com", icon: "X", label: "X" },
  { href: "https://www.youtube.com", icon: "Youtube", label: "YouTube" },
];

export default function SocialLinks() {
  return (
    <div className={css.socialColumn}>
      <ul className={css.socialLinks}>
        {socialLinks.map(({ href, icon, label }) => (
          <li key={label}>
            <Link
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={css.socialLink}
              aria-label={label}
            >
              <Icon name={icon} className={css.socialIcon} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

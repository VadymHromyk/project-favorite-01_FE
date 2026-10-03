import Image from "next/image";
import css from "./ProfileInfo.module.css";

const ProfileInfo = ({ avatar, username, locationsCount }) => {
  return (
    <div className={css.profile}>
      <Image
        className={css.avatar}
        src={avatar}
        alt={username}
        width={145}
        height={145}
      />

      <div className={css.avatarContent}>
        <h1 className={css.username}>{username}</h1>

        <p className={css.articlesCount}>Статей: {locationsCount}</p>
      </div>
    </div>
  );
};

export default ProfileInfo;

import Link from "next/link";
import css from "./ProfilePlaceholder.module.css";

const ProfilePlaceholder = ({ isOwnProfile }) => {
  return (
    <div className={css.profilePlaceholder}>
      {isOwnProfile ? (
        <>
          <p className={css.text}>
            Ви ще нічого не публікували, поділіться своєю першою локацією!
          </p>

          <Link className={css.link} href="/locations/add">
            Поділитись локацією
          </Link>
        </>
      ) : (
        <>
          <p className={css.text}>Цей користувач ще не ділився локаціями</p>

          <Link className={css.link} href="/">
            Назад до локацій
          </Link>
        </>
      )}
    </div>
  );
};

export default ProfilePlaceholder;

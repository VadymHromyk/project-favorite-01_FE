import { isAxiosError } from "axios";

type LocationFormAction = "create" | "edit";

const UNAUTHORIZED_MESSAGES: Record<LocationFormAction, string> = {
  create: "Увійдіть, щоб опублікувати місце",
  edit: "Увійдіть, щоб зберегти зміни",
};

const FALLBACK_MESSAGES: Record<LocationFormAction, string> = {
  create: "Не вдалося опублікувати місце. Спробуйте ще раз",
  edit: "Не вдалося зберегти зміни. Спробуйте ще раз",
};

export const getLocationErrorMessage = (
  error: unknown,
  mode: LocationFormAction,
) => {
  const status = isAxiosError(error) ? error.response?.status : undefined;

  switch (status) {
    case 400:
      return "Перевірте правильність заповнення полів";
    case 401:
      return UNAUTHORIZED_MESSAGES[mode];
    case 403:
      return "Ви не можете редагувати це місце";
    case 404:
      return "Місце не знайдено";
    default:
      return FALLBACK_MESSAGES[mode];
  }
};

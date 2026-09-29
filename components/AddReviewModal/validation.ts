import * as Yup from 'yup';

export const reviewValidationSchema = Yup.object().shape({
    rate: Yup.number()
        .min(1, 'Оберіть хоча б одну зірочку')
        .max(5, 'Максимальна оцінка — 5')
        .required('Рейтинг є обовʼязковим'),
    description: Yup.string()
        .min(1, 'Відгук не може бути порожнім')
        .max(200, 'Максимальна довжина відгуку — 200 символів')
        .required('Введіть текст відгуку'),
});

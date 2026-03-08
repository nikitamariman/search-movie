# Mariman Movies - Клон Кинопоиска

Поиск фильмов с возможностью фильтрации по жанрам, детальной информацией и трейлерами.

## Демо
https://nikitamariman.github.io/search-movie/

## Технологии
- React + Vite
- Tailwind CSS v4
- React Router
- Kinopoisk API (unofficial)

## Функциональность
- Поиск фильмов с debounce
- Фильтрация по жанрам
- Детальная страница фильма с описанием и трейлерами
- Адаптивный дизайн
- Автоматическое переключение на локальные данные при недоступности API

## Установка и запуск

git clone https://github.com/ваш-логин/search-movie.git
cd search-movie
npm install
npm run dev

## Получение API ключа
1. Зарегистрируйтесь на https://kinopoiskapiunofficial.tech
2. Скопируйте ключ в файл .env
3. VITE_KINOPOISK_API_KEY=ваш_ключ_здесь

## Структура проекта

src/
  components/     - переиспользуемые компоненты
  pages/          - страницы (главная, страница фильма)
  hooks/          - кастомные React хуки
  services/       - работа с API
  data/           - локальные данные
  utils/          - константы

## Лицензия
MIT
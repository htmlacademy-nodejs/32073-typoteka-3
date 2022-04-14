
INSERT INTO users(email, password_hash, first_name, last_name, avatar) VALUES
  ('ivanov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Иван', 'Иванов', 'avatar1.jpg'),
	('petrov@example.com', '5f4dcc3b5aa765d61d8327deb882cf99', 'Пётр', 'Петров', 'avatar2.jpg');
INSERT INTO categories(name) VALUES
  ('Деревья'),
	('За жизнь'),
	('Без рамки'),
	('Разное'),
	('IT'),
	('Музыка'),
	('Кино'),
	('Программирование'),
	('Железо');
ALTER TABLE articles DISABLE TRIGGER ALL;
INSERT INTO articles(title, announce, full_text, picture, user_id) VALUES
  ('Лучше рок-музыканты 20-века', 'Программировать не настолько сложно как об этом говорят. Первая большая ёлка была установлена только в 1938 году. Он написал больше 30 хитов. Игры и программирование разные вещи. Не стоит идти в программисты если вам нравится только игры.', 'Простые ежедневные упражнения помогут достичь успеха. Из под его пера вышло 8 платиновых альбомов. Как начать действовать? Для начала просто соберитесь. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Он написал больше 30 хитов. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Этот смартфон — настоящая находка. Большой и яркий экран мощнейший процессор — всё это в небольшом гаджете. Достичь успеха помогут ежедневные повторения.', 'undefined', 1);
ALTER TABLE articles ENABLE TRIGGER ALL;
ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
  (1, 7);
ALTER TABLE articles_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(article_id, user_id, text) VALUES
  (1, 2, '"Планируете записать видосик на эту тему?"'),
	(1, 2, '"Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.",  "Мне кажется или я уже читал это где-то?",'),
	(1, 1, '"Планируете записать видосик на эту тему?"'),
	(1, 2, '"Мне кажется или я уже читал это где-то?",');
ALTER TABLE comments ENABLE TRIGGER ALL;
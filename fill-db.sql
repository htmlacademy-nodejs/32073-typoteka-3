
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
INSERT INTO articles(title, announce, full_text, image, user_id) VALUES
  ('Обзор новейшего смартфона', 'Золотое сечение — соотношение двух величин гармоническая пропорция. Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать. Он написал больше 30 хитов. Как начать действовать? Для начала просто соберитесь.', 'Вы можете достичь всего. Стоит только немного постараться и запастись книгами. Из под его пера вышло 8 платиновых альбомов. Достичь успеха помогут ежедневные повторения. Помните небольшое количество ежедневных упражнений лучше чем один раз но много. Бороться с прокрастинацией несложно. Просто действуйте. Маленькими шагами. Это один из лучших рок-музыкантов. Рок-музыка всегда ассоциировалась с протестами. Так ли это на самом деле? Ёлки — это не просто красивое дерево. Это прочная древесина. Он написал больше 30 хитов. Простые ежедневные упражнения помогут достичь успеха. Освоить вёрстку несложно. Возьмите книгу новую книгу и закрепите все упражнения на практике. Золотое сечение — соотношение двух величин гармоническая пропорция. Первая большая ёлка была установлена только в 1938 году. Как начать действовать? Для начала просто соберитесь. Собрать камни бесконечности легко если вы прирожденный герой. Процессор заслуживает особого внимания. Он обязательно понравится геймерам со стажем. Программировать не настолько сложно как об этом говорят.', 'forest@1x.jpg', 1);
ALTER TABLE articles ENABLE TRIGGER ALL;
ALTER TABLE articles_categories DISABLE TRIGGER ALL;
INSERT INTO articles_categories(article_id, category_id) VALUES
  (1, 5);
ALTER TABLE articles_categories ENABLE TRIGGER ALL;
ALTER TABLE comments DISABLE TRIGGER ALL;
INSERT INTO comments(article_id, user_id, text) VALUES
  (1, 1, '"Согласен с автором!", '),
	(1, 1, '"Планируете записать видосик на эту тему?" "Мне не нравится ваш стиль. Ощущение, что вы меня поучаете.", "Хочу такую же футболку :-)",'),
	(1, 1, '"Согласен с автором!",'),
	(1, 1, '"Хочу такую же футболку :-)",');
ALTER TABLE comments ENABLE TRIGGER ALL;
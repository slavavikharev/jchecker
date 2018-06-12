# jchecker

## Как запустить:

1) Установить все зависимости

```bash
yarn install
```

2) Указать логин и пароль бота от anytask.org. Это можно сделать двумя способами

2.1) Указать данные в переменных окружения

```bash
export ANYTASK_LOGIN=<login>
export ANYTASK_PASSWORD=<password>
```

2.2) Указать данные в конфиге

```bash
echo '{"anytask": {"credentials": {"login": <login>, "password": <password>}}}' > ./config/secure.json
export NODE_ENV=secure
```

3) Запустить

```bash
node ./index.js
```

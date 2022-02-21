# DoSports-backend

## Документация DoSports API

Ниже приведены инструкции по взаимодействию с базой данных сайта DoSports.

### Начало работы

Для начала установите npm-модуль Axios.

```
npm install axios
```

Импортируйте модуль в своём файле

```js
import axios from 'axios'
```

Взаимодействие с базой данных осуществляется с помощью двух типов запросов:

* GET
    ```js
    axios.get(url);
    ```
* POST
    ```js
    axios.post(url, entry);
    ```
  entry - входные данные. Обычно это объект.

Axios взаимодействует с базой данных через асинхронные запросы. Так, получить данные можно следующим способом:

```js
axios.get("https://dosports.ru/api/users/login-is-unique/Crack_Man").then((data) => {
    console.log(data); // true или false 
});
```

или

```js
let response = await axios.get("https://dosports.ru/api/users/login-is-unique/Crack_Man");
console.log(response.data); // true или false
```

### Список команд

#### Пользователи

##### 1. Получить список логинов

```js
let response = await axios.get(`https://dosports.ru/api/users/get-logins`);
console.log(response.data); // JSON логинов
```

##### 2. Получить список почтовых адресов

```js
let response = await axios.get(`https://dosports.ru/api/users/get-emails`);
console.log(response.data); // JSON почтовых адресов
```

##### 3. Проверить, является ли данный логин уникальным

```js
let login = "Crack-Man";
let response = await axios.get(`https://dosports.ru/api/users/login-is-unique/${login}`);
console.log(response.data); // true или false
```

##### 4. Проверить, является ли данная почта уникальной

```js
let email = "example@gmail.com"
let response = await axios.get(`https://dosports.ru/api/users/email-is-unique/${email}`);
console.log(response.data); // true или false
```

##### 5. Добавить пользователя

```js
let newUser = {
    fullname: "Иванов Иван", // минимум два слова, кириллица, максимальное количество символов: 50
    gender: "m", // или "f"
    birthday: '1999-10-18', // в формате YYYY-MM-DD
    id_region: 1,
    email: "example@gmail.com", // латинские символы или цифры, без пробелов
    login: "Crack_Man", // латинские символы, цифры, знак подчеркивания, точка, максимальное количество символов: 20
    password: "1234567", // не должны встречаться знаки ', " и `, минимальное количество символов: 7
}
  
let response = await axios.post(`https://dosports.ru/api/users/add-user`, newUser);
console.log(response.data); // сообщение об успешной регистрации или наличии какой-либо ошибки
```
response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success" // или "Error"
    text: "" // текст ошибки или сообщение об успешной регистрации
}
```

После выполнения запроса происходит проверка логина и почты на уникальность, хешируется
пароль, генерируется код активации и отсылается пользователю.

##### 6. Активировать пользователя

```js
let code = "$asdl$23414zfjSxc";
let response = await axios.get(`https://dosports.ru/api/users/activate/${code}`);
console.log(response.data); // сообщение о том, что пользователь успешно активирован, или данный код не найден
```

##### 7. Авторизация пользователя

```js
let user = {
    login: "Crack_Man" // также на этом месте может быть email
    password: "1234567"
}
let response = await axios.post(`https://dosports.ru/api/users/auth`, user);
console.log(response.data);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    message: "" // "Неверный пароль", "Пользователь не найден" или "", если авторизация прошла успешно
    token: { // если авторизация успешная
        access: "saxdjkdjkl$#3.213dfasf.1234rf", // срок хранения - 30 минут, многоразовый
        refresh: "saxdjkdjkl$#3.213dfasf.1234rf" // срок хранения - 30 дней, одноразовый        
    }
}
```
Токены должны находиться в локальном хранилище

##### 8. Проверка TOKEN ACCESS

```js
let tokenAccess = "saxdjkdjkl$#3.213dfasf.1234rf";

let response = await axios.post(`https://dosports.ru/api/users/verify-token-access`, tokenAccess);
console.log(response.data)''
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success" // или "Error"
    text: "" // текст ошибки, если name === "Error"
    user: { // информация о пользователе, если name === "Success"
        // ...
    }
}
```

##### 9. Проверка TOKEN REFRESH

```js
let tokenRefresh = "saxdjkdjkl$#3.213dfasf.1234rf";

let response = await axios.post(`https://dosports.ru/api/users/verify-token-access`, tokenAccess);
console.log(response.data)
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success" // или "Error"
    text: "" // текст ошибки, если name === "Error"
    token: { // если name === "Success" 
        access: "saxdjkdjkl$#3.213dfasf.1234rf", // срок хранения - 30 минут, многоразовый
        refresh: "saxdjkdjkl$#3.213dfasf.1234rf" // срок хранения - 30 дней, одноразовый        
    }
    user: { // информация о пользователе, если name === "Success"
        // ...
    }
}
```

##### 10. Восстановление пароля: отправить код подтверждения

```js
let data = {
    email: "example@gmail.com"
}

let response = await axios.post(`https://dosports.ru/api/users/resend-code`, data);
console.log(response.data)
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success" // или "Error"
    text: "" // текст ошибки, если name === "Error", либо сообщение о необходимости ввести код, который придёт на почту
}
```

После выполнения запроса генерируется 5-значный код и отсылается на почту. Почта должна встречаться в базе данных, иначе система говорит, что пользователь не найден.

___

##### 11. Восстановление пароля: переотправить код подтверждения

Происходит то же самое, что и в предыдущем пункте, но код не генерируется заново.

##### 12. Восстановление пароля: проверить код подтверждения

```js
let data = {
    email: "example@gmail.com",
    code: 12345
}

let response = await axios.post(`https://dosports.ru/api/users/compare-code`, data);
console.log(response.data)
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success" // или "Error"
    text: "" // текст ошибки, если name === "Error"
}
```

##### 13. Восстановление пароля: проверить код подтверждения

```js
let data = {
    email: "example@gmail.com",
    password: "1234567"
    code: 12345,
}

let response = await axios.post(`https://dosports.ru/api/users/compare-code`, data);
console.log(response.data)
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success" // или "Error"
    text: "" // текст ошибки, если name === "Error", либо сообщение об успешном восстановлении пароля
}
```

#### Регионы

##### 1. Получить список регионов

```js
let response = await axios.get(`https://dosports.ru/api/regions/get-regions`);
console.log(response.data) // JSON регионов
```
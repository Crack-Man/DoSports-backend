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
    fullname: "Иванов Иван", // максимальное количество символов: 50
    gender: "m", // или "f"
    birthday: '1999-10-18', // в формате YYYY-MM-DD
    id_region: 1,
    email: "example@gmail.com", // латинские символы или цифры, без пробелов
    login: "Crack_Man", // латинские символы, цифры, знак подчеркивания, точка, максимальное количество символов: 20
    password: "1234567", // не должны встречаться знаки ', " и `, минимальное количество символов: 7
}

let response = await axios.post(`https://dosports.ru/api/users/add-user`, newUser);
console.log(response.data);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "" // текст ошибки или сообщение об успешной регистрации
}
```

После выполнения запроса происходит проверка логина и почты на уникальность, хешируется пароль, генерируется код
активации и отсылается пользователю.

##### 6. Добавить пользователя (без подтверждения аккаунта и отправки письма)

newUser тот же самый, что в п. 5

```js
let response = await axios.post("/add-user-mobile", newUser);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    token: {access: "...", refresh: "..."} // если name === "Success"
}
```

##### 7. Переотправить код подтверждения регистрации

```js
let newUser = {
    email: "example@gmail.com", // латинские символы или цифры, без пробелов
}

let response = await axios.post(`https://dosports.ru/api/users/activate/resend-code`, newUser);
console.log(response.data);
```

Происходит то же самое, что и в предыдущем пункте, но код не генерируется заново.

##### 8. Активировать пользователя

```js
let code = "$asdl$23414zfjSxc";
let response = await axios.get(`https://dosports.ru/api/users/activate/${code}`);
console.log(response.data); // сообщение о том, что пользователь успешно активирован, или данный код не найден
```

##### 9. Авторизация пользователя

```js
let user = {
    login: "Crack_Man", // также на этом месте может быть email
    password: "1234567"
}
let response = await axios.post(`https://dosports.ru/api/users/auth`, user);
console.log(response.data);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    message: "", // "Неверный пароль", "Пользователь не найден" или "", если авторизация прошла успешно
    token: { // если авторизация успешная
        access: "saxdjkdjkl$#3.213dfasf.1234rf", // срок хранения - 30 минут, многоразовый
        refresh: "saxdjkdjkl$#3.213dfasf.1234rf" // срок хранения - 30 дней, одноразовый        
    }
}
```

Токены должны находиться в локальном хранилище

##### 10. Проверка TOKEN ACCESS

```js
let tokenAccess = "saxdjkdjkl$#3.213dfasf.1234rf";

let response = await axios.post(`https://dosports.ru/api/users/verify-token-access`, tokenAccess);
console.log(response.data)
''
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    user: { // информация о пользователе, если name === "Success"
        // ...
    }
}
```

##### 11. Проверка TOKEN REFRESH

```js
let tokenRefresh = "saxdjkdjkl$#3.213dfasf.1234rf";

let response = await axios.post(`https://dosports.ru/api/users/verify-token-access`, tokenAccess);
console.log(response.data)
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    token: { // если name === "Success" 
        access: "saxdjkdjkl$#3.213dfasf.1234rf", // срок хранения - 30 минут, многоразовый
        refresh: "saxdjkdjkl$#3.213dfasf.1234rf" // срок хранения - 30 дней, одноразовый        
    },
    user: { // информация о пользователе, если name === "Success"
        // ...
    }
}
```

##### 12. Восстановление пароля: отправить код подтверждения

```js
let data = {
    email: "example@gmail.com"
}

let response = await axios.post(`https://dosports.ru/api/users/send-code`, data);
console.log(response.data)
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "" // текст ошибки, если name === "Error", либо сообщение о необходимости ввести код, который придёт на почту
}
```

После выполнения запроса генерируется 5-значный код и отсылается на почту. Почта должна встречаться в базе данных, иначе
система говорит, что пользователь не найден.

___

##### 13. Восстановление пароля: переотправить код подтверждения

```js
let data = {
    email: "example@gmail.com"
}

let response = await axios.post(`https://dosports.ru/api/users/resend-code`, data);
console.log(response.data)
```

Происходит то же самое, что и в предыдущем пункте, но код не генерируется заново.

##### 14. Восстановление пароля: проверить код подтверждения

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
    name: "Success", // или "Error"
    text: "" // текст ошибки, если name === "Error"
}
```

##### 15. Восстановление пароля: изменить пароль

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
    name: "Success", // или "Error"
    text: "" // текст ошибки, если name === "Error", либо сообщение об успешном восстановлении пароля
}
```

##### 16. Войти с помощью VK

Необходимо произвести редирект на данную страницу: https://dosports.ru/api/vk-auth, где пользователь выдает необходимые
права. После данной процедуры происходит редирект на страницу https://dosports.ru/vk-reg.

Далее идет работа с токеном, выдаваемым VK.
Если пользователь пытается авторизоваться с ПК, то в Local Storage появляется ключ vk-token.
Если мобильное приложение, токен можно получить из url-слага.

Далее этот токен нужно дешифровать, для этого используется следующий POST-запрос:

```js
let token = {value: "sadhjasdanffabh"};
let response = await axios.post(`https://dosports.ru/api/vk-auth/decode-token-vk`, token);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    user: {  // если name === "Success"
      displayName: "Ivan Ivanov",
      username: "crak_man",
      gender: "male",
      id: 14789124,
      email: "example@gmail.com" // свойство может отсутствовать
    }
}
```

##### 17. Проверить, есть ли пользователь VK в базе данных

```js
let id_vk = 14789124;
let user = {id: id_vk};

let response = await axios.post(`https://dosports.ru/api/vk-auth/user-in-db`, user);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    match: true, // или false, если пользователь отсутсвует
    token: {access: "...", refresh: "..."} // если match === true
}
```

##### 18. Добавить пользователя VK

```js
let newUser = {
    fullname: "Ivan Ivanov", // максимальное количество символов: 50
    gender: "male", // или "female", или "f", "m" (сервер сам исправит)
    birthday: '1999-10-18', // в формате YYYY-MM-DD
    id_region: 1,
    id_vk: 235782358,
    email: "example@gmail.com", // латинские символы или цифры, без пробелов
    login: "Crack_Man", // латинские символы, цифры, знак подчеркивания, точка, максимальное количество символов: 20
    password: "1234567" // значение может быть пустым
}

let response = await axios.post(`https://dosports.ru/api/vk-auth/add-user`, newUser);
console.log(response.data);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    token: {access: "...", refresh: "..."} // если name === "Success"
}
```

#### Регионы

##### 1. Получить список регионов

```js
let response = await axios.get(`https://dosports.ru/api/regions/get-regions`);
console.log(response.data) // JSON регионов
```

#### Программы (база)

##### 1. Получить список образов жизни

```js
let response = await axios.get(`https://dosports.ru/api/programs/get-lifestyles`);
console.log(response.data) // JSON образов жизни
```

##### 2. Получить список весовых категорий

```js
let response = await axios.get(`https://dosports.ru/api/programs/get-weight-categories`);
console.log(response.data) // JSON весовых категорий
```

##### 3. Создать программу

```js
let newUser = {
    idUser: 1,
    bmi: 20,
    lifestyle: 1, // id образа жизни из БД
    weight: 60,
    weightCategory: 1, // id весовой категории из БД
    height: 173,
    trainPrepare: 0, // или 1 (можно строковый тип данных)
    norm: {
        proteins: 100,
        fats: 100,
        carbohydrates: 100,
        calories: 100,
        fibers: 100
    }
}

let response = await axios.post("https://dosports.ru/api/programs/get-lifestyles", program);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 4. Проверить, имеет ли на данный момент пользователь активную программу

```js
let idUser = 1;

let response = await axios.get(`https://dosports.ru/api/programs/user-has-active-program/${idUser}`);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: true, // или false, либо текст ошибки, если name === "Error"
}
```

##### 5. Закрыть программу (сделать неактивной)

```js
let program = {
    id: 1
};

let response = await axios.post(`https://dosports.ru/api/programs/deactivate-program`, program);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: true, // текст ошибки, если name === "Error"
}
```

##### 6. Показать базовую информацию о программе

```js
let program = {
    id: 1
};

let response = await axios.post(`https://dosports.ru/api/programs/get-program`, program);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    program: {...}
}
```
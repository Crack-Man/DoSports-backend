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
console.log(response.data) // true или false
```

### Список команд

#### Пользователи

* Получить список логинов
    ```js;
    let response = await axios.get(`https://dosports.ru/api/users/get-logins`);
    console.log(response.data) // JSON логинов
    ```
* Получить список почтовых адресов
    ```js;
    let response = await axios.get(`https://dosports.ru/api/users/get-emails`);
    console.log(response.data) // JSON почтовых адресов
    ```
* Проверить, является ли данный логин уникальным
    ```js
    let login = "Crack-Man";
    let response = await axios.get(`https://dosports.ru/api/users/login-is-unique/${login}`);
    console.log(response.data) // true или false
    ```
* Проверить, является ли данная почта уникальной
    ```js
    let email = "example@gmail.com"
    let response = await axios.get(`https://dosports.ru/api/users/email-is-unique/${email}`);
    console.log(response.data) // true или false
    ```
* Добавить пользователя
    ```js
    let newUser = {
        fullname: "Иванов Иван", // минимум два слова, максимальное количество символов: 50
        gender: "m", // или "f"
        birthday: '1999-10-18', // в формате YYYY-MM-DD
        id_region: 1,
        email: "example@gmail.com",
        login: "Crack_Man", // максимальное количество символов: 20
        password: "1234567", // минимальное количество символов: 7
    }
  
    let response = await axios.post(`https://dosports.ru/api/users/add-user`, newUser);
    console.log(response.data) // сообщение об успешной регистрации или наличии какой-либо ошибки
    ```
  После выполнения запроса происходит проверка логина и почты на уникальность, генерируется код активации, хешируется пароль.
* Активировать пользователя
    ```js
    let code = "$asdl$23414zfjSxc";
    let response = await axios.get(`https://dosports.ru/api/users/activate/${code}`);
    console.log(response.data) // сообщение о том, что пользователь успешно активирован, или данный код не найден
    ```
* Отправить тестовое сообщение на указанный E-MAIL
    ```js
    let email = "example@gmail.com";
    let response = await axios.get(`https://dosports.ru/api/users/test-mail/${email}`);
    console.log(response.data) // сообщение о том, что сообщение успешно отправлено, или произошла какая-то ошибка
    ```
___
#### Регионы

* Получить список регионов
    ```js
    let response = await axios.get(`https://dosports.ru/api/regions/get-regions`);
    console.log(response.data) // JSON регионов
    ```
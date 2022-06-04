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

Далее идет работа с токеном, выдаваемым VK. Если пользователь пытается авторизоваться с ПК, то в Local Storage
появляется ключ vk-token. Если мобильное приложение, токен можно получить из url-слага.

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
    aim: 0, // 0 - поддержание веса, 1 - сброс веса, 2 - набор веса
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

#### Программы (прием пищи)

##### 1. Получить список продуктов

```js
let response = await axios.get(`https://dosports.ru/api/programs/get-foods`);
console.log(response.data) // JSON продуктов
```

##### 2. Получить список категорий продуктов

```js
let response = await axios.get(`https://dosports.ru/api/programs/get-food-categories`);
console.log(response.data) // JSON категорий продуктов
```

##### 3. Добавить приемы пищи на текущий день

```js
this.program = {
    idProgram: 1,
    mealsNumber: 3, // до 5
    date: "25.05.2022",
    carbohydratesDegree: 1, // 0 - низкоуглеводный день, 1 - средне, 2 - высоко
    mealSchedule: [
        {
            time: "07:00-09:00",
            idOrder: 1, // название приема пищи (завтрак, обед и т.д.)
        },

        {
            time: "12:00-14:00",
            idOrder: 3,
        },

        {
            time: "16:00-18:00",
            idOrder: 5,
        }
    ]
};

let response = await axios.post(`https://dosports.ru/api/programs/add-program-diet`, program);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 4. Получить приемы пищи и продукты на каждый прием за текущий день

```js
let program = {
    idProgram: 1,
    date: "25.05.2022"
}

let response = await axios.post(`https://dosports.ru/api/programs/get-program-diet`, program);
console.log(response.data) // JSON приемов пищи и продуктов
```

##### 5. Удалить приемы пищи вместе с входящими в него продуктами/блюдами

```js
let program = {
    id: 1, // поле id_program_diet, обозначающее программу диеты на текущий день
}

let response = await axios.post(`https://dosports.ru/api/programs/delete-program-diet`, program);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 6. Добавить продукт в прием пищи

```js
let food = {
    idFood: 1,
    amount: 100, // в граммах
    idMeal: 1, // id приема пищи
}

let response = await axios.post(`https://dosports.ru/api/programs/add-meal-food`, food);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 7. Получить продукты/блюда на прием пищи

```js
let id = 1;

let response = await axios.get(`https://dosports.ru/api/programs/get-meal-foods/${id}`);
console.log(response.data) // JSON продуктов/блюд
```

##### 8. Удалить продукт/блюдо из приема пищи

```js
let food = {
    id: 1
};

let response = await axios.post(`https://dosports.ru/api/programs/delete-meal-food`, food);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 9. Получить продукт по его id

```js
let id = 1;

let response = await axios.get(`https://dosports.ru/api/programs/get-food-by-id/${id}`);
console.log(response.data) // JSON продукта
```

##### 10. Обновить граммовку продукта/блюда

```js
let food = {
    id: 1,
    amount: 200,
}

let response = await axios.post(`https://dosports.ru/api/programs/update-amount-food`, food);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 11. Получить все продукты/блюда программы по id

```js
let program = {
    id: 1, // id программы
}

let response = await axios.post(`https://dosports.ru/api/programs/get-meal-data-by-program-id`, program);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    foods: {
        //...
    }
}
```

##### 12. Создать собственный продукт

```js
let food = {
    name: "Хлеб",
    idCategory: 1,
    proteins: 10,
    fats: 10,
    carbohydrates: 10,
    calories: 10,
    fibers: 10,
    glycemicIndex: 10,
    idAuthor: 1
}

let response = await axios.post(`https://dosports.ru/api/programs/add-personal-food`, food);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 13. Получить список собственных продуктов

```js
let id = 1; // id пользователя

let response = await axios.get(`https://dosports.ru/api/programs/get-personal-foods/${id}`);
console.log(response.data) // JSON продуктов
```

##### 14. Обновить данные по собственному продукту

```js
let food = {
    id: 1, // id продукта
    name: "Хлеб",
    idCategory: 1,
    proteins: 10,
    fats: 10,
    carbohydrates: 10,
    calories: 10,
    fibers: 10,
    glycemicIndex: 10,
    idAuthor: 1
}

let response = await axios.post(`https://dosports.ru/api/programs/update-personal-food`, food);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 15. Удалить собственный продукт

```js
let food = {
    id: 1, // id продукта
}

let response = await axios.post(`https://dosports.ru/api/programs/delete-personal-food`, food);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 15. Создать рацион

```js
let ration = {
    idUser: 1,
    name: "Завтрак",
    foods: {
        id_food: 1,
        amount: 50,
    }
}

let response = await axios.post(`https://dosports.ru/api/programs/add-ration`, ration);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 16. Добавить рациону продукт

```js
let food = {
    idFood: 1,
    amount: 50,
    idRation: 1,
}

let response = await axios.post(`https://dosports.ru/api/programs/add-ration-food`, food);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 17. Добавить рацион в прием пищи

```js
let ration = {
    idMeal: 1,
    foods: {
        id_food: 1,
        amount: 50,
    }
}

let response = await axios.post(`https://dosports.ru/api/programs/add-ration-to-meal`, ration);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 18. Обновить граммовку продукта из рациона

```js
let food = {
    id: 1, // id продукта из рациона
    amount: 50,
}

let response = await axios.post(`https://dosports.ru/api/programs/update-amount-ration-food`, food);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 19. Удалить продукт из рациона

```js
let food = {
    id: 1, // id продукта из рациона
}

let response = await axios.post(`https://dosports.ru/api/programs/delete-ration-food`, food);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 20. Получить список рационов пользователя

```js
let id = 1; // id пользователя

let response = await axios.get(`https://dosports.ru/api/programs/get-users-rations/${id}`);
console.log(response.data) // JSON рационов
```

##### 21. Получить список продуктов/блюд рациона

```js
let id = 1; // id рациона

let response = await axios.get(`https://dosports.ru/api/programs/get-ration-foods/${id}`);
console.log(response.data) // JSON продуктов
```

##### 22. Удалить рацион

```js
let ration = {
    id: 1, // id продукта из рациона
}

let response = await axios.post(`https://dosports.ru/api/programs/delete-ration`, ration);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 23. Добавить блюдо

```js
let dish = {
    idUser: 1,
    name: "Оливье",
}

let response = await axios.post(`https://dosports.ru/api/programs/add-dish`, dish);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 24. Добавить продукт в блюдо

```js
let food = {
    idFood: 1,
    amount: 100,
    idDish: 1,
}

let response = await axios.post(`https://dosports.ru/api/programs/add-dish-food`, food);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 25. Удалить блюдо

```js
let dish = {
    id: 1
}

let response = await axios.post(`https://dosports.ru/api/programs/delete-dish`, dish);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 26. Получить список блюд пользователя

```js
idUser = 1;

let response = await axios.get(`https://dosports.ru/api/programs/get-users-dishes/${idUser}`);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    dishes: [
        // Список блюд       
    ]
}
```

##### 27. Получить список продуктов в блюде

```js
idDish = 1;

let response = await axios.get(`https://dosports.ru/api/programs/get-dish-foods/${idDish}`);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    foods: [
        // Список продуктов       
    ]
}
```

##### 28. Обновить граммовку продукта блюда

```js
let food = {
    id: 1, // id продукта из блюда
    amount: 50,
}

let response = await axios.post(`https://dosports.ru/api/programs/update-amount-dish-food`, food);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 29. Удалить продукт из блюда

```js
let food = {
    id: 1 // id продукта из блюда
}

let response = await axios.post(`https://dosports.ru/api/programs/delete-dish-food`, food);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 30. Добавить блюдо в прием пищи

```js
let dish = {
    idDish: 1,
    amount: 50,
    idMeal: 1
}

let response = await axios.post(`https://dosports.ru/api/programs/add-meal-dish`, dish);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

#### Программы (тренировки)

#### Монетизация

##### 1. Получить прайслист

```js
let response = await axios.get(`https://dosports.ru/api/programs/get-pricelist`);
console.log(response.data) // JSON списка услуг
```

##### 2. Получить ссылку на оплату

```js
let payData = {
    days: 1,
    cost: 1, // в рублях
    user: {
        email: "...",
    }
}

let response = await axios.post(`https://dosports.ru/api/programs/get-pay-link`, payData);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    link: "..." // ссылка на оплату
}
```

##### 3. Проверить, имеет ли пользователь премиум-подписку

```js
let user = {
    id: 1
}

let response = await axios.post(`https://dosports.ru/api/programs/user-is-pro`, payData);
```

response.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    pro: true // или false, если пользователь не имеет подписки
}
```
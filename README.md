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
axios.get("https://dosports.ru/api/users/login-is-unique/Crack_Man").then((res) => {
    console.log(res.data); // true или false 
});
```

### Список команд

#### Пользователи

##### 1. Получить список логинов

```js
await axios.get(`https://dosports.ru/api/users/get-logins`).then((res) => {
  console.log(res.data); // JSON логинов
});
```

##### 2. Получить список почтовых адресов

```js
await axios.get(`https://dosports.ru/api/users/get-emails`).then((res) => {
  console.log(res.data); // JSON почтовых адресов
});
```

##### 3. Проверить, является ли данный логин уникальным

```js
let login = "Crack-Man";
await axios.get(`https://dosports.ru/api/users/login-is-unique/${login}`).then((res) => {
  console.log(res.data); // true или false
});
```

##### 4. Проверить, является ли данная почта уникальной

```js
let email = "example@gmail.com"
await axios.get(`https://dosports.ru/api/users/email-is-unique/${email}`).then((res) => {
  console.log(res.data); // true или false
});
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

await axios.post(`https://dosports.ru/api/users/add-user`, newUser).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

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
await axios.post("/add-user-mobile", newUser).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/users/activate/resend-code`, newUser).then((res) => {
  console.log(res.data);
});
```

Происходит то же самое, что и в предыдущем пункте, но код не генерируется заново.

##### 8. Активировать пользователя

```js
let code = "$asdl$23414zfjSxc";
await axios.get(`https://dosports.ru/api/users/activate/${code}`).then((res) => {
  console.log(res.data); // сообщение о том, что пользователь успешно активирован, или данный код не найден
});
```

##### 9. Авторизация пользователя

```js
let user = {
    login: "Crack_Man", // также на этом месте может быть email
    password: "1234567"
}
await axios.post(`https://dosports.ru/api/users/auth`, user).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/users/verify-token-access`, tokenAccess).then((res) => {
  console.log(res.data)
});
''
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/users/verify-token-access`, tokenAccess).then((res) => {
  console.log(res.data)
});
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/users/send-code`, data).then((res) => {
  console.log(res.data)
});
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/users/resend-code`, data).then((res) => {
  console.log(res.data)
});
```

Происходит то же самое, что и в предыдущем пункте, но код не генерируется заново.

##### 14. Восстановление пароля: проверить код подтверждения

```js
let data = {
    email: "example@gmail.com",
    code: 12345
}

await axios.post(`https://dosports.ru/api/users/compare-code`, data).then((res) => {
  console.log(res.data)
});
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/users/compare-code`, data).then((res) => {
  console.log(res.data)
});
```

res.data представляет собой JSON следующего вида:

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
await axios.post(`https://dosports.ru/api/vk-auth/decode-token-vk`, token).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/vk-auth/user-in-db`, user).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/vk-auth/add-user`, newUser).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

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
await axios.get(`https://dosports.ru/api/regions/get-regions`).then((res) => {
  console.log(res.data) // JSON регионов
});
```

#### Программы (база)

##### 1. Получить список образов жизни

```js
await axios.get(`https://dosports.ru/api/programs/get-lifestyles`).then((res) => {
  console.log(res.data) // JSON образов жизни
});
```

##### 2. Получить список весовых категорий

```js
await axios.get(`https://dosports.ru/api/programs/get-weight-categories`).then((res) => {
  console.log(res.data) // JSON весовых категорий
});
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

await axios.post("https://dosports.ru/api/programs/get-lifestyles", program).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 4. Проверить, имеет ли на данный момент пользователь активную программу

```js
let idUser = 1;

await axios.get(`https://dosports.ru/api/programs/user-has-active-program/${idUser}`).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/programs/deactivate-program`, program).then((res) => {
  console.log(res.data); // true или false 
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 6. Показать базовую информацию о программе

```js
let program = {
    id: 1
};

await axios.post(`https://dosports.ru/api/programs/get-program`, program).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

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
await axios.get(`https://dosports.ru/api/programs/get-foods`).then((res) => {
  console.log(res.data) // JSON продуктов
});
```

##### 2. Получить список категорий продуктов

```js
await axios.get(`https://dosports.ru/api/programs/get-food-categories`).then((res) => {
  console.log(res.data) // JSON категорий продуктов
});
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

await axios.post(`https://dosports.ru/api/programs/add-program-diet`, program).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/programs/get-program-diet`, program).then((res) => {
  console.log(res.data) // JSON приемов пищи и продуктов
});
```

##### 5. Удалить приемы пищи вместе с входящими в него продуктами/блюдами

```js
let program = {
    id: 1, // поле id_program_diet, обозначающее программу диеты на текущий день
}

await axios.post(`https://dosports.ru/api/programs/delete-program-diet`, program).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/programs/add-meal-food`, food).then((res) => {
  console.log(res.data); // true или false 
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 7. Получить продукты/блюда на прием пищи

```js
let id = 1;

await axios.get(`https://dosports.ru/api/programs/get-meal-foods/${id}`).then((res) => {
  console.log(res.data) // JSON продуктов/блюд
});
```

##### 8. Удалить продукт/блюдо из приема пищи

```js
let food = {
    id: 1
};

await axios.post(`https://dosports.ru/api/programs/delete-meal-food`, food).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 9. Получить продукт по его id

```js
let id = 1;

await axios.get(`https://dosports.ru/api/programs/get-food-by-id/${id}`).then((res) => {
  console.log(res.data) // JSON продукта
});
```

##### 10. Обновить граммовку продукта/блюда

```js
let food = {
    id: 1,
    amount: 200,
}

await axios.post(`https://dosports.ru/api/programs/update-amount-food`, food).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/programs/get-meal-data-by-program-id`, program).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/programs/add-personal-food`, food).then((res) => {
  console.log(res.data); 
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 13. Получить список собственных продуктов

```js
let id = 1; // id пользователя

await axios.get(`https://dosports.ru/api/programs/get-personal-foods/${id}`).then((res) => {
  console.log(res.data) // JSON продуктов
});
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

await axios.post(`https://dosports.ru/api/programs/update-personal-food`, food).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/programs/delete-personal-food`, food).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 16. Создать рацион

```js
let ration = {
    idUser: 1,
    name: "Завтрак",
    foods: {
        id_food: 1,
        amount: 50,
    }
}

await axios.post(`https://dosports.ru/api/programs/add-ration`, ration).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 17. Добавить рациону продукт

```js
let food = {
    idFood: 1,
    amount: 50,
    idRation: 1,
}

await axios.post(`https://dosports.ru/api/programs/add-ration-food`, food).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 18. Добавить рацион в прием пищи

```js
let ration = {
    idMeal: 1,
    foods: {
        id_food: 1,
        amount: 50,
    }
}

await axios.post(`https://dosports.ru/api/programs/add-ration-to-meal`, ration).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 19. Обновить граммовку продукта из рациона

```js
let food = {
    id: 1, // id продукта из рациона
    amount: 50,
}

await axios.post(`https://dosports.ru/api/programs/update-amount-ration-food`, food).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 20. Удалить продукт из рациона

```js
let food = {
    id: 1, // id продукта из рациона
}

await axios.post(`https://dosports.ru/api/programs/delete-ration-food`, food).then((res) => {
  console.log(res.data); 
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 21. Получить список рационов пользователя

```js
let id = 1; // id пользователя

await axios.get(`https://dosports.ru/api/programs/get-users-rations/${id}`).then((res) => {
  console.log(res.data) // JSON рационов
});
```

##### 22. Получить список продуктов/блюд рациона

```js
let id = 1; // id рациона

await axios.get(`https://dosports.ru/api/programs/get-ration-foods/${id}`).then((res) => {
  console.log(res.data) // JSON продуктов
});
```

##### 23. Удалить рацион

```js
let ration = {
    id: 1, // id продукта из рациона
}

await axios.post(`https://dosports.ru/api/programs/delete-ration`, ration).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 24. Добавить блюдо

```js
let dish = {
    idUser: 1,
    name: "Оливье",
}

await axios.post(`https://dosports.ru/api/programs/add-dish`, dish).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 25. Добавить продукт в блюдо

```js
let food = {
    idFood: 1,
    amount: 100,
    idDish: 1,
}

await axios.post(`https://dosports.ru/api/programs/add-dish-food`, food).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 26. Удалить блюдо

```js
let dish = {
    id: 1
}

await axios.post(`https://dosports.ru/api/programs/delete-dish`, dish).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 27. Получить список блюд пользователя

```js
idUser = 1;

await axios.get(`https://dosports.ru/api/programs/get-users-dishes/${idUser}`).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    dishes: [
        // Список блюд       
    ]
}
```

##### 28. Получить список продуктов в блюде

```js
idDish = 1;

await axios.get(`https://dosports.ru/api/programs/get-dish-foods/${idDish}`).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    foods: [
        // Список продуктов       
    ]
}
```

##### 29. Обновить граммовку продукта блюда

```js
let food = {
    id: 1, // id продукта из блюда
    amount: 50,
}

await axios.post(`https://dosports.ru/api/programs/update-amount-dish-food`, food).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 30. Удалить продукт из блюда

```js
let food = {
    id: 1 // id продукта из блюда
}

await axios.post(`https://dosports.ru/api/programs/delete-dish-food`, food).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 31. Добавить блюдо в прием пищи

```js
let dish = {
    idDish: 1,
    amount: 50,
    idMeal: 1
}

await axios.post(`https://dosports.ru/api/programs/add-meal-dish`, dish).then((res) => {
  console.log(res.data); 
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

#### Программы (тренировки)

##### 1. Получить доступные тренировочные режимы

```js
let program = {
    aim: 0, // цель программы: 0 - поддержание веса, 1 - сброс веса, 2 - набор веса
    trainPrepare: 0, // уровень подготовленности к тренировкам: 0 - новичок, 1 - профессионал
}

await axios.post(`https://dosports.ru/api/programs/get-train-mods`, program).then((res) => {
  console.log(res.data)
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    mods: [] // JSON тренирочоных режимов
}
```

##### 2. Получить тренировочные программы

```js
let program = {
    aim: 0, // цель программы: 0 - поддержание веса, 1 - сброс веса, 2 - набор веса
    trainPrepare: 0, // уровень подготовленности к тренировкам: 0 - новичок, 1 - профессионал
}

await axios.post(`https://dosports.ru/api/programs/get-trains`, program).then((res) => {
  console.log(res.data)
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    trains: [] // JSON тренировочных программ
}
```

##### 3. Добавить тренировочную программу на текущий день

```js
let program = {
    idProgram: 1,
    date: 20.06.2022,
    idTrainExample: 1, // id тренировочной программы
}

await axios.post(`https://dosports.ru/api/programs/add-train-program`, program).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

##### 4. Получить тренировочную программу на текущий день

```js
let program = {
    id: 1, // id программы
    date: 20.06.2022,
}

await axios.post(`https://dosports.ru/api/programs/get-train-program`, program).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    trains: "", // JSON тренировочной программы
}
```

##### 5. Удалить тренировочную программу из текущего дня

```js
let program = {
    idProgram: 1, // id программы
    date: 20.06.2022,
}

await axios.post(`https://dosports.ru/api/programs/delete-train-program`, program).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
}
```

#### Программы (дневник)

##### 1. Получить данные дневника на текущий день

```js
let parameters = {
  idUser: 1,
  date: 2022-06-20 // пример: 20 июня 2022 года
}

await axios.post(`https://dosports.ru/api/programs/get-diary-by-date`, parameters).then((res) => {
  console.log(res.data)
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    params: {} // JSON параметров: вес, обхват груди и т.д.
}
```

##### 2. Добавить/обновить данные на текущий день

```js
let parameters = {
  weight: 55, // вес (кг), вещественное число
  bust: 55, // обхват груди (см), вещественное число
  hip: 55, // обхват бедер (см), вещественное число
  waist: 55, // обхват талии (см), вещественное число
  bicep: 55, // обхват бицепса (см), вещественное число
  shin: 55, // обхват голени (см), вещественное число
  neck: 55, // обхват шеи (см), вещественное число
}

await axios.post(`https://dosports.ru/api/programs/add-diary`, parameters).then((res) => {
  console.log(res.data)
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    params: {} // JSON параметров
}
```

##### 3. Получить дневник на пользователя

```js
let user = {
  id: 1, // id пользователя
}

await axios.post(`https://dosports.ru/api/programs/get-user-diary`, user).then((res) => {
  console.log(res.data)
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    diary: [] // JSON параметров на все дни в БД
}
```

#### Монетизация

##### 1. Получить прайслист

```js
await axios.get(`https://dosports.ru/api/programs/get-pricelist`).then((res) => {
  console.log(res.data) // JSON списка услуг
});
```

##### 2. Получить ссылку на оплату (PayKeeper)

```js
let payData = {
    days: 1,
    cost: 1, // в рублях
    user: {
        email: "...",
    }
}

await axios.post(`https://dosports.ru/api/programs/get-pay-link`, payData).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

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

await axios.post(`https://dosports.ru/api/programs/user-is-pro`, payData).then((res) => {
  console.log(res.data);
});
```

res.data представляет собой JSON следующего вида:

```js
let data = {
    name: "Success", // или "Error"
    text: "", // текст ошибки, если name === "Error"
    pro: true // или false, если пользователь не имеет подписки
}
```
//генерация имени

export function generateNickname(firstName, lastName, attempt = 0) {
  const firstPart = firstName.slice(0, 3).toLowerCase();
  const lastPart = lastName.slice(0, 3).toLowerCase();
  const randomNum = Math.floor(Math.random() * 990) + 10;
  
  // Добавим немного уникальности в зависимости от попытки
  const modifiers = ['', '_', '0', '77', 'vip'];
  const mod = modifiers[attempt] || '';
  
  return `${firstPart}${lastPart}${randomNum}${mod}`;
}

// Проверка уникальности
export async function checkNicknameUnique(nickname) {
  const response = await fetch(`http://localhost:3000/users?nickname=${nickname}`);
  const users = await response.json();
  return users.length === 0;
}

// Использование
async function handleNicknameGeneration() {
  const firstName = document.getElementById('firstName').value;
  const lastName = document.getElementById('lastName').value;
  
  let nickname;
  let attempts = 0;
  let isUnique = false;
  
  do {
    nickname = generateNickname(firstName, lastName, attempts);
    isUnique = await checkNicknameUnique(nickname);
    attempts++;
    
    if (attempts >= 5) {
      // Даём пользователю ввести вручную
      document.getElementById('nickname').disabled = false;
      document.getElementById('nickname').value = nickname;
      break;
    }
  } while (!isUnique);
  
  if (attempts < 5) {
    document.getElementById('nickname').value = nickname;
  }
}
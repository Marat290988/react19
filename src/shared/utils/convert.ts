export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error("Ошибка при чтении файла"));
      }
    };
    reader.onerror = () => reject(new Error("Ошибка при загрузке файла"));
    reader.readAsDataURL(file); // Преобразование в Base64
  });
};

export function formatDate(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, '0');

  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${hours}:${minutes} ${day}.${month}.${year}`;
}

export function formatNumberWithSpaces(number: number, decimals: number = 0): string {
  // Преобразуем число в строку и фиксируем нужное количество знаков после запятой
  const numStr = number.toFixed(decimals);

  // Разделяем строку на целую и дробную части
  const [integerPart, decimalPart] = numStr.split('.');

  // Разделяем целую часть на группы по три цифры и добавляем пробелы
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  // Соединяем целую и дробную части обратно
  return decimalPart ? `${formattedIntegerPart}.${decimalPart}` : formattedIntegerPart;
}
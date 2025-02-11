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
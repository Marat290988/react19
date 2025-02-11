/**
 * Проверяет, является ли Blob изображением, сжимает его до размеров 72x72 пикселей
 * и возвращает изображение в формате base64.
 * @param blob - Blob объекта изображения.
 * @param quality - Качество сжатия (от 0 до 1). По умолчанию 0.8.
 * @returns Promise<string> - Сжатое изображение в формате base64.
 */
export async function compressImageToBase64(blob: Blob, quality: number = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    // Проверяем, что Blob — это изображение
    if (!blob.type.startsWith("image/")) {
      reject(new Error("Предоставленный Blob не является изображением"));
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        // Создаем Canvas для изменения размера изображения
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Не удалось создать контекст Canvas"));
          return;
        }

        // Устанавливаем размеры 72x72 пикселя
        canvas.width = 72;
        canvas.height = 72;

        // Рисуем изображение в Canvas
        ctx.drawImage(img, 0, 0, 72, 72);

        // Получаем сжатое изображение в формате base64
        canvas.toDataURL("image/jpeg", quality).toString();

        resolve(canvas.toDataURL("image/jpeg", quality));
      };

      img.onerror = () => reject(new Error("Не удалось загрузить изображение"));
      if (reader.result) img.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error("Ошибка при чтении Blob"));
    reader.readAsDataURL(blob); // Читаем Blob как base64
  });
}
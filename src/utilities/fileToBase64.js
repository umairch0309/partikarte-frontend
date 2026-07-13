export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      const base64 = String(result).split(",")[1] || "";
      resolve(base64);
    };

    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsDataURL(file);
  });
}

export async function filesToAttachments(fileList = []) {
  return Promise.all(
    fileList.map(async (file) => ({
      filename: file.name,
      content: await fileToBase64(file),
    }))
  );
}

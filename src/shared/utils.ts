// @ts-ignore
import kebabCase from "lodash.kebabcase";

export const formatFileName = (name: string) => {
  const splitted = name.split(".");

  const extension = splitted.slice(-1)[0];
  const baseName = splitted.slice(0, -1).join(".");

  return `${Date.now()}-${kebabCase(
    baseName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
  )}.${extension}`;
};

export const formatFileSize = (size: number) => {
  let i = Math.floor(Math.log(size) / Math.log(1024));

  return `${(size / Math.pow(1024, i)).toFixed(1)} ${
    ["B", "KB", "MB", "GB", "TB"][i]
  }`;
};

// @ts-ignore
import kebabCase from "lodash.kebabcase";

export const formatFileName = (name: string) => {
  const splitted = name.split(".");

  const extension = splitted.slice(-1)[0];
  const baseName = splitted.slice(0, -1).join(".");

  return `${kebabCase(
    baseName
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
  )}-${Date.now()}.${extension}`;
};

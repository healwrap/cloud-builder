import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 递归根据id查找对象
 * @param object 传入的对象数组
 * @param id 查找的id
 * @returns 查找到的对象
 */
export function getObjectById<T extends { id: string }>(object: T[], id: string): T | undefined {
  if (!id) return undefined;
  for (const obj of object) {
    if (obj.id === id) {
      return obj;
    }
    if ('children' in obj) {
      const children = obj.children;
      if (!Array.isArray(children)) continue;
      const found = getObjectById(children, id);
      if (found) return found;
    }
  }
  return undefined;
}
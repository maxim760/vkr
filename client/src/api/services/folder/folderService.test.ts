import { folderApi } from "./folderService"
import { vi, test, expect } from 'vitest';
const mockPost = vi.hoisted(() => vi.fn().mockReturnValue({ data: { } }));
const mockDelete = vi.hoisted(() => vi.fn().mockReturnValue({ data: { } }));

vi.mock('../../host', () => {
  return {
    api: {
      post: mockPost,
      delete: mockDelete,
    }
  }
})

test('Метод создания папки', () => {
  folderApi.create({ name: 'Название' })
  expect(mockPost).toHaveBeenCalledWith('/folder/create', expect.anything())
})

test('Метод удаления папки', () => {
  folderApi.delete('1')
  expect(mockDelete).toHaveBeenCalledWith('/folder/1')
})
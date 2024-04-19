import { tokenService } from "./tokens"
import { describe, test, expect } from 'vitest'

describe('tokenService', () => {
  test('Установка токена', () => {
    tokenService.setAccessToken('token')
    expect(tokenService.getAccessToken()).toBe('token')
  });
  test('Удаление токена', () => {
    tokenService.setAccessToken('token')
    expect(tokenService.getAccessToken()).not.toBe('')
    tokenService.removeAccessToken()
    expect(tokenService.getAccessToken()).toBe('')
  });
})
import authService from "./auth.service"

    jest.mock('../user/user.repo', () => {
      return {
        userRepo: {
          findOne: () => ({
            name: 'user',
            email: 'email',
            userSpaces: [{
              is_selected: true,
              is_edit: true,
              is_admin: false,
              space: { id: '1', value: 'value' }
            }]
          })
        }
      }
    })

    describe('Сервис пользователей', () => {
      describe('Поиск пространства по email пользователя', () => {
        test('Если email не передан, возвращается пустое значение', async () => {
          expect(await authService.findSpaceIdByEmail('')).toEqual({
            activeSpace: null,
            canEdit: false,
          })
        });
        test('Если email передан, возвращаются данные из БД', async () => {
          expect(await authService.findSpaceIdByEmail('email')).toEqual({
            activeSpace: { id: '1', value: 'value' },
            canEdit: true,
            isAdmin: false
          })
        })
      })
    })
export type Space = {
  id: string,
  name: string,
  userSpaces: [
    {
      "userToSpacesId": string,
      "is_edit": boolean,
      "is_admin": boolean,
      "is_selected": boolean,
      "user": {
          "id": string,
          "displayName": string,
          "email": string,
      }
    }
  ]
}
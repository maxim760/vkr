export type Recipe = {
  id: string,
  name: string,
  description: string,
  tags: string[],
  ingredients: string[],
  time_recipe?: string,
  steps: {
    name: string,
    photos: string[],
    time_step?: string,
  }[],
  folder?: {
    id?: string,
  }
}


export type FolderRecipe = {
  id: string,
  name: string,
  recipes: Recipe[]
}
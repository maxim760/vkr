import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, AfterRemove, ManyToOne, OneToMany } from "typeorm";
import { User } from "../user/user.entity";
import { Recipe } from "../recipe/recipe.entity";
import { Space } from "../space/space.entity";

@Entity({name: "folders"})
export class Folder {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Recipe, recipe => recipe.folder)
  recipes: Recipe[];

  @ManyToOne(() => Space, space => space.recipes)
  space: Space

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}


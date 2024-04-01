import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, AfterRemove, OneToMany } from "typeorm";
import { UserSpaces } from "../user/user-space.entity";
import { User } from "../user/user.entity";
import { Recipe } from "../recipe/recipe.entity";
import { Folder } from "../folder/folder.entity";

@Entity({name: "spaces"})
export class Space {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({default: ""})
  name: string

  @OneToMany(() => UserSpaces, userSpace => userSpace.space)
  userSpaces: UserSpaces[];

  @OneToMany(() => Recipe, recipe => recipe.space)
  recipes: Recipe[];

  @OneToMany(() => Folder, folder => folder.space)
  folders: Folder[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


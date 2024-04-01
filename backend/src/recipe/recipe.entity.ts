import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, AfterRemove, ManyToOne, OneToMany } from "typeorm";
import { User } from "../user/user.entity";
import { RecipeStep } from "../core/types";
import { Space } from "../space/space.entity";
import { Folder } from "../folder/folder.entity";

@Entity({name: "recipes"})
export class Recipe {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column("text")
  description: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @Column('simple-array')
  tags: string[];

  @Column('simple-array')
  ingredients: string[];

  @Column()
  time_recipe: string;

  @Column("json")
  steps: RecipeStep[]

  @ManyToOne(() => Space, space => space.recipes)
  space: Space;

  @ManyToOne(() => Folder, folder => folder.recipes, { nullable: true })
  folder: Folder | null;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}


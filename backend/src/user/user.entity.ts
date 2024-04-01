import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, AfterRemove, OneToMany } from "typeorm";
import { Space } from "../space/space.entity";
import { UserSpaces } from "./user-space.entity";

@Entity({name: "users"})
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({name: "display_name", default: ""})
  displayName: string

  @Column({unique: true, nullable: false})
  email: string

  @Column()
  password: string

  @Column({ default: "" })
  refreshToken: string;

  @OneToMany(() => UserSpaces, userSpaces => userSpaces.user)
  userSpaces: UserSpaces[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  toJSON() {
    const { refreshToken, password, ...props } = this
    return props
  }
}


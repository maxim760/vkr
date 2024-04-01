import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Space } from "../space/space.entity";
import { User } from "./user.entity";

@Entity({ name: 'user_spaces', })
export class UserSpaces {
  @PrimaryGeneratedColumn('uuid')
  public userToSpacesId: string;
  
  @ManyToOne(() => User, user => user.userSpaces)
  user: User;

  @ManyToOne(() => Space, space => space.userSpaces)
  space: Space;

  @Column({ default: false })
  is_edit: boolean;

  @Column({ default: false })
  is_admin: boolean;

  @Column({ default: false })
  is_selected: boolean;

}
import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, AfterRemove, ManyToOne } from "typeorm";
import { Address } from "../address/address.entity";
import { Curier } from "../curier/curier.entity";
import { Goods } from "../goods/goods.entity";
import { User } from "../user/user.entity";

@Entity({name: "orders"})
export class Order {
  @PrimaryGeneratedColumn("uuid")
  id: string;


  @ManyToOne(() => User, (user: User) => user.orders, {onDelete: "SET NULL", nullable: true})
  user: User

  @ManyToMany(() => Goods, { onDelete: "CASCADE" })
  @JoinTable({
    name: "order_goods",
    joinColumn: { name: "order_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "goods_id", referencedColumnName: "id" },

  })
  goods: Goods[];

  @Column({ name: "with_delivery", default: false })
  withDelivery: boolean
  @Column()
  price: number;
  @Column({name: "done", default: false})
  done: boolean;

  @ManyToOne(() => Curier, (curier) => curier.orders, {onDelete: "SET NULL", nullable: true})
  @JoinColumn({name: "curier_id"})
  curier: Curier

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

}


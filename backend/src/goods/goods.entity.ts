import { Column, CreateDateColumn, UpdateDateColumn, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToOne, JoinColumn, AfterRemove } from "typeorm";
import { Address } from "../address/address.entity";
import { Order } from "../order/order.entity";
import { Product } from "../product/product.entity";
import { Role } from "../role/role.entity";

@Entity({name: "goods"})
export class Goods {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({name: "good_type", default: ""})
  goodsType: string

  @Column({default: 0})
  discount: number;

  @Column()
  price: number;
  @Column({name: "current_price"})
  currentPrice: number;
  @Column({default: ""})
  name: string;
  @Column({default: ""})
  description: string;
  @Column({default: ""})
  img: string;

  @ManyToMany(() => Product, {onDelete: "CASCADE"})
  @JoinTable({
    name: "product_goods",
    joinColumn: { name: "goods_id", referencedColumnName: "id" },
    inverseJoinColumn: { name: "product_id", referencedColumnName: "id" }
  })
  products: Product[]

  @ManyToMany(() => Order, { onDelete: "CASCADE" })
  orders: Order[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}


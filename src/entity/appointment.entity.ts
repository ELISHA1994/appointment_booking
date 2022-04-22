import {Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";

export enum Status {
    OPEN = "open",
    CLOSE = "close"
}

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: 'date'})
    start : string;

    @Column({type: 'date'})
    end : string;

    @Column()
    title : string;

    @Column({
        type: 'enum',
        enum: Status,
        default: Status.OPEN
    })
    status: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;


}

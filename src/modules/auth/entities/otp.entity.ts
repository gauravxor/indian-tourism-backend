import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryColumn,
    Unique,
} from 'typeorm';

import generateCuid from '@utils/cuid';
import { User } from '@root/src/modules/user/entities/user.entity';

@Entity()
@Unique(['userId', 'purpose'])
export class Otp {
    @PrimaryColumn({ type: 'varchar', length: 24 })
    id: string;

    @Column({ type: 'varchar', length: 6 })
    otp: string;

    @Column({
        type: 'varchar',
        length: 15,
        comment: 'The delivery medium used to send the OTP (SMS or email)',
    })
    medium: string;

    @Column({ type: 'varchar', length: 30 })
    purpose: string;

    @ManyToOne(() => User, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    userId: User;

    @Column({ type: 'timestamp with time zone', name: 'expires_at' })
    expiresAt: Date;

    @CreateDateColumn({ type: 'timestamp with time zone', name: 'created_at' })
    createdAt: Date;

    @BeforeInsert()
    setId() {
        this.id = generateCuid();
    }
}

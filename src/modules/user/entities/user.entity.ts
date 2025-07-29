import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import { UserRole } from '@root/src/common/enums/user-role.enum';
import generateCuid from '@utils/cuid';

@Entity()
export class User {
    @PrimaryColumn({ type: 'varchar', length: 24 })
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    profile_image: string;

    @Column({ type: 'boolean', default: false })
    is_active: boolean;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.NORMAL })
    role: UserRole;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;

    @BeforeInsert()
    setId() {
        this.id = generateCuid();
    }
}

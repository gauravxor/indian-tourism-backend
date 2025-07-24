import {
    BeforeInsert,
    Column,
    CreateDateColumn,
    Entity,
    PrimaryColumn,
    UpdateDateColumn,
} from 'typeorm';

import generateCuid from '@utils/cuid';

@Entity()
class User {
    @PrimaryColumn({ type: 'varchar', length: 36 })
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255 })
    password: string;

    @Column({ type: 'varchar', length: 255 })
    profile_image: string;

    @Column({ type: 'boolean', default: false })
    is_active: boolean;

    @CreateDateColumn({ type: 'timestamp with time zone' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp with time zone' })
    updated_at: Date;

    @BeforeInsert()
    setId() {
        this.id = generateCuid();
    }
}

export default User;

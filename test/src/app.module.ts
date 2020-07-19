import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dbConfig from './db.config';
import { User } from './entities/users';
import { Role } from './entities/roles';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), TypeOrmModule.forFeature([Role, User])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import dbConfig from './db.config';
import { User } from './entities/users';
import { Role } from './entities/roles';
import { Place } from './entities/places';

@Module({
  imports: [TypeOrmModule.forRoot(dbConfig), TypeOrmModule.forFeature([Role, User, Place])],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/users';
import { Role } from './entities/roles';
import { Place } from './entities/places';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Place)
    private readonly placeRepository: Repository<Place>,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getUser(id: string) {
    return this.userRepository.findOne(id);
  }

  async createUser(data: any) {
    let response = await this.roleRepository.insert(data.role);
    response = await this.userRepository.insert({ ...data.user, roleId: response.identifiers[0].id });
    return this.userRepository.findOne(response.identifiers[0].id);
  }

  async updateUser(id: string, patch: any) {
    await this.userRepository.update(id, patch);
    return this.userRepository.findOne(id);
  }

  async removeUser(id: string) {
    return this.userRepository.delete(id);
  }

  async getPlaces() {
    return this.placeRepository.find();
  }
}

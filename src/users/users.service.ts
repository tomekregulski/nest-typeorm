import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // argument name: repo
  // set to private to allow creation/assignmnet in a single line of code
  // typed to Repository with a generic type of User (instance of TypeORM Repository that deals with instances of Users)
  // Injection system does not handle generics well, so InjectRepository decorator expicitly sets User as a dependency
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    // create a new instance of User entity with the request body properties
    // this step allows additional validation logic tied directly to the entity, or other create-step biz logic (i.e. hooks)
    const user = this.repo.create({ email, password });

    // save the new instance to the DB
    // can use this fully instead of create(), but then hooks will not be executed
    // best habit is to always create() and then save()
    return this.repo.save(user);
  }

  // always return one record or null
  findOne(id: number) {
    // fix for SQLite because it reads id: null as first id as a table, so this prevents that query from being made
    if (!id) {
      return null;
    }
    return this.repo.findOneBy({ id });
  }

  // returns array of all entries that match the criteria, or an empty array
  find(email: string) {
    return this.repo.find({ where: { email }});
  }

  // Pull out the matching user, apply the incoming changes, and save that user to the DB
  // This requires two trips to the DB, but ensures any necessary hooks run
  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }
    // copies properties of second argument, overwriting any existing values for those properties
    Object.assign(user, attrs);
    // TypeORM has methods insert() and update(), but they do not run hooks
    return this.repo.save(user);
  }

  // Pull out the matching user and remove the entry from the DB
  // This requires two trips to the DB, but ensures any necessary hooks run
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('user not found');
    }
    // TypeORM has methods delete(), but it will not run hooks
    return this.repo.remove(user);
  }
}

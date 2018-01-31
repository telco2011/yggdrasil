import { DeepPartial } from 'typeorm/common/DeepPartial.d';
import { Connection, MongoEntityManager, Entity, SaveOptions, ObjectType } from 'typeorm';
import { validate } from 'class-validator';

export class YggdrasilMongodbEntityManager extends MongoEntityManager {

  constructor(connection: Connection) {
    super(connection);
  }

  // tslint:disable-next-line
  async save < Entity, T extends DeepPartial < Entity >> (targetOrEntity: (T | T[]) | ObjectType < Entity > | string, maybeEntityOrOptions ? : T | T[], maybeOptions ? : SaveOptions): Promise < T | T[] > {

    // tslint:disable-next-line
    const target = (arguments.length > 1 && (targetOrEntity instanceof Function || typeof targetOrEntity === 'string')) ? targetOrEntity as Function|string : undefined;
    // tslint:disable-next-line
    const entity: T|T[] = target ? maybeEntityOrOptions as T|T[] : targetOrEntity as T|T[];
    // tslint:disable-next-line
    const options = target ? maybeOptions : maybeEntityOrOptions as SaveOptions;

    // tslint:disable-next-line
    const errors = await validate(entity);
    if (errors.length > 0) {
      throw Error('Errors validating request body object');
    }

    return super.save(target, entity, options);
  }

}

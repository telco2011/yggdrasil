import { Request, Response } from 'express';

import { FileLogger } from '../logger';

export abstract class DBBaseCtrl {

  abstract model: any;
  abstract logger = new FileLogger('DBBaseCtrl');

  // Get all
  getAll = (req: Request, res: Response) => {
    this.model.find({}, (err, docs) => {
      if (err) { return console.error(err); }
      res.json(docs);
    });
  }

  // Count all
  count = (req: Request, res: Response) => {
    this.model.count((err, count) => {
      if (err) { return this.logger.error(err); }
      res.json(count);
    });
  }

  // Insert
  insert = (req: Request, res: Response) => {
    const obj = new this.model(req.body);
    this.logger.debug(`Session test: ${req.session.user}`);
    this.logger.debug('Insert object:', obj);
    obj.save((err, item) => {
      // 11000 is the code for duplicate key error
      if (err && err.code === 11000) {
        res.status(400).send({ errorMessage: 'User already exists.' });
      }
      if (err) {
        return this.logger.error(err);
      }
      res.status(200).json(item);
    });
  }

  // Get by id
  get = (req: Request, res: Response) => {
    this.logger.debug('Get object with id:', req.params.id);
    this.model.findOne({ _id: req.params.id }, (err, obj) => {
      if (err) { return this.logger.error(err); }
      res.json(obj);
    });
  }

  // Update by id
  update = (req: Request, res: Response) => {
    this.logger.debug('Update object:', JSON.stringify(req.body), 'with ID', req.params.id);
    this.model.findOneAndUpdate({ _id: req.params.id }, req.body, (err, updatedUser) => {
      if (err) {
        this.logger.error(err);
        return res.sendStatus(400);
      }
      this.logger.debug('Updated object', JSON.stringify(updatedUser));
      res.sendStatus(200);
    });
  }

  // Delete by id
  delete = (req: Request, res: Response) => {
    this.model.findOneAndRemove({ _id: req.params.id }, (err) => {
      if (err) { return this.logger.error(err); }
      res.sendStatus(200);
    });
  }
}

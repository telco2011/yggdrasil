import * as fs from 'fs';
import * as path from 'path';
import * as rfs from 'rotating-file-stream';

import { WriteStream } from 'fs';

import { Utils } from '../common';

/**
 * Morgan utilities class.
 */
export class MorganUtils {

  /** Contains the access log name. */
  private static MORGAN_LOG_NAME = 'access.log';

  /** Stream to create the access log. */
  private accessLogStream: WriteStream;
  /** Log directory path. */
  private logDirectory: string;

  /**
   * Default constructor.
   */
  constructor() {
    this.accessLogStream = null;
    this.logDirectory = process.env.LOG_PATH || Utils.appLogsPath;
    this.ensureLogDirectoryExists();
  }

  /**
   * Ensures if log directory is created. If not, it creates.
   * @returns void
   */
  private ensureLogDirectoryExists(): void {
    if (!fs.existsSync(this.logDirectory)) {
      try {
        fs.mkdirSync(this.logDirectory);
      } catch (error) {
        // TODO: Manage errors
        console.error('Error creating log directory.', error);
      }
    }
  }
  /**
   * Gets the stream to create the morgan access log.
   * @param {MorganRotateOptions} options To configure morgan rotate log.
   * - If it is null, it returns a stream to create a file in append mode.
   * - If it is not null, it returns a stream to create a rotating files.
   * @returns {WriteStream} Morgan access log stream.
   */
  getAccessLogStream(options?: MorganRotateOptions): WriteStream {

    if (options == null) {
      // create a write stream (in append mode)
      this.accessLogStream = fs.createWriteStream(path.join(this.logDirectory, MorganUtils.MORGAN_LOG_NAME), { flags: 'a' });
    } else {
      // create a rotating write stream
      this.accessLogStream = rfs(MorganUtils.MORGAN_LOG_NAME, {
        interval: options.interval,
        maxFiles: options.maxFiles,
        maxSize: options.maxSize,
        path: this.logDirectory
      });
    }

    return this.accessLogStream;
  }
}

/**
 * Morgan Rotation interface.
 * For more information see https://github.com/iccicci/rotating-file-stream/blob/master/README.md.
 */
export interface MorganRotateOptions {

  /**
   * Specifies the file size to rotate the file.
   *
   * Accepts a positive integer followed by one of these possible letters:
   * * __B__: Bites
   * * __K__: KiloBites
   * * __M__: MegaBytes
   * * __G__: GigaBytes
   *
   * ```javascript
   * size: '300B', // rotates the file when size exceeds 300 Bytes
   * ```
   * ```javascript
   * size: '300K', // rotates the file when size exceeds 300 KiloBytes
   * ```
   * ```javascript
   * size: '100M', // rotates the file when size exceeds 100 MegaBytes
   * ```
   * ```javascript
   * size: '1G', // rotates the file when size exceeds a GigaByte
   * ```
   */
  size: string;

  /**
   * Specifies the time interval to rotate the file.
   *
   * Accepts a positive integer followed by one of these possible letters:
   *
   * * __s__: seconds. Accepts integer divider of 60.
   * * __m__: minutes. Accepts integer divider of 60.
   * * __h__: hours. Accepts integer divider of 24.
   * * __d__: days
   * ```javascript
   * interval: '5s', // rotates at seconds 0, 5, 10, 15 and so on
   * ```
   * ```javascript
   * interval: '5m', // rotates at minutes 0, 5, 10, 15 and so on
   * ```
   * ```javascript
   * interval: '2h', // rotates at midnight, 02:00, 04:00 and so on
   * ```
   * ```javascript
   * interval: '1d', // rotates at every midnight
   * ```
   */
  interval: string;

  /** Specifies the maximum number of rotated files to keep. */
  maxFiles: number;

  /** Specifies the maximum size of rotated files to keep. */
  maxSize: string;

  /** Specifies compression method of rotated files. */
  compress?: string;

  /** Proxied to new stream.Writable */
  highWaterMark?: number;

  /** Specifies the history filename. */
  history?: string;

  /** Eventually makes an initial rotation based on not-rotated file timestamp. */
  initialRotation?: boolean;

  /** Proxied to fs.createWriteStream */
  mode?: number;

  /** Enables the classical UNIX logrotate behaviour. */
  rotate?: number;

  /** Makes rotated file name with time of rotation instead of start time of period. */
  rotationTime?: boolean;

}

import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'node:crypto';
import { GenerateMd5HashParams } from 'src/payments/dto/interface';

@Injectable()
export class HashingService {
  saltOrRounds = 10;

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt(this.saltOrRounds);
    return bcrypt.hash(password, salt);
  }
  async comparePassword(password: string, hashedPassword: string) {
    return bcrypt.compare(password, hashedPassword);
  }
  md5(content: string, algo = 'md5') {
    const hashFunc = createHash(algo);
    hashFunc.update(content);
    return hashFunc.digest('hex');
  }
  public generateMD5(params: GenerateMd5HashParams, algo = 'md5') {
    const content = `${params.clickTransId}${params.serviceId}${
      params.secretKey
    }${params.merchantTransId}${params?.merchantPrepareId || ''}${
      params.amount
    }${params.action}${params.signTime}`;

    const hashFunc = createHash(algo);
    hashFunc.update(content);
    return hashFunc.digest('hex');
  }
}

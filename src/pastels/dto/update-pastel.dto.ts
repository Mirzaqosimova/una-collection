import { PartialType } from '@nestjs/mapped-types';
import { CreatePastelDto } from './create-pastel.dto';

export class UpdatePastelDto extends PartialType(CreatePastelDto) {}

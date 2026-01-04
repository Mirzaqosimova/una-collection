import { PartialType } from '@nestjs/mapped-types';
import { CreatePastelOptionDto } from './create-pastel_option.dto';

export class UpdatePastelOptionDto extends PartialType(CreatePastelOptionDto) {}

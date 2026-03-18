import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsDateString,
  IsArray,
  ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBranchDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsNumber()
  @Type(() => Number)
  customerId: number;

  @IsString()
  @IsOptional()
  contactPerson?: string;
}

export class UpdateBranchDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;
}

// ==================== DEVICES DTOs ====================
// src/devices/dto/device.dto.ts
// import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsDateString } from 'class-validator';

enum DeviceCategory {
  LAPTOP = 'LAPTOP',
  DESKTOP = 'DESKTOP',
  PRINTER = 'PRINTER',
  AIO = 'AIO',
  SERVER = 'SERVER',
  NETWORK = 'NETWORK',
}

enum ProcessorType {
  INTEL_I3 = 'INTEL_I3',
  INTEL_I5 = 'INTEL_I5',
  INTEL_I7 = 'INTEL_I7',
  INTEL_I9 = 'INTEL_I9',
  AMD_RYZEN3 = 'AMD_RYZEN3',
  AMD_RYZEN5 = 'AMD_RYZEN5',
  AMD_RYZEN7 = 'AMD_RYZEN7',
  AMD_RYZEN9 = 'AMD_RYZEN9',
}

export class CreateDeviceDto {
  @IsEnum(DeviceCategory)
  category: DeviceCategory;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  serialNumber: string;

  @IsString()
  @IsOptional()
  ram?: string;

  @IsString()
  @IsOptional()
  storage?: string;

  @IsString()
  @IsOptional()
  os?: string;

  @IsString()
  @IsOptional()
  motherboardName?: string;

  @IsString()
  @IsOptional()
  motherboardSerial?: string;

  @IsEnum(ProcessorType)
  @IsOptional()
  processor?: ProcessorType;

  @IsDateString()
  @IsOptional()
  installationDate?: string;

  @IsDateString()
  @IsOptional()
  warrantyExpiry?: string;

  @IsNumber()
  @Type(() => Number)
  branchId: number;

  @IsString()
  @IsOptional()
  purchaseOrderNumber?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  purchasePrice?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateDeviceDto {
  @IsEnum(DeviceCategory)
  @IsOptional()
  category?: DeviceCategory;

  @IsString()
  @IsOptional()
  company?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  ram?: string;

  @IsString()
  @IsOptional()
  storage?: string;

  @IsString()
  @IsOptional()
  os?: string;

  @IsString()
  @IsOptional()
  motherboardName?: string;

  @IsString()
  @IsOptional()
  motherboardSerial?: string;

  @IsEnum(ProcessorType)
  @IsOptional()
  processor?: ProcessorType;

  @IsDateString()
  @IsOptional()
  warrantyExpiry?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

// ==================== SERVICE CALLS DTOs ====================
// src/service-calls/dto/service-call.dto.ts
// import { IsString, IsNotEmpty, IsOptional, IsNumber,  } from 'class-validator';

enum ServiceCallStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
  CANCELLED = 'CANCELLED',
}

enum ServiceCallPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class CreateServiceCallDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  errorCode?: string;

  @IsEnum(ServiceCallPriority)
  priority: ServiceCallPriority;

  @IsNumber()
  @Type(() => Number)
  deviceId: number;



  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  engineerId?: number;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;
}

export class UpdateServiceCallDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(ServiceCallStatus)
  @IsOptional()
  status?: ServiceCallStatus;

  @IsEnum(ServiceCallPriority)
  @IsOptional()
  priority?: ServiceCallPriority;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  engineerId?: number;

  @IsDateString()
  @IsOptional()
  scheduledDate?: string;

  @IsDateString()
  @IsOptional()
  resolvedDate?: string;

  @IsString()
  @IsOptional()
  resolutionNotes?: string;
}

// ==================== WORK UPDATES DTOs ====================
// src/work-updates/dto/work-update.dto.ts


class SparePartDto {
  @IsString()
  @IsNotEmpty()
  partName: string;

  @IsString()
  @IsOptional()
  capacity?: string;

  @IsString()
  @IsOptional()
  oldSerial?: string;

  @IsString()
  @IsOptional()
  newSerial?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  quantity?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  cost?: number;
}

export class CreateWorkUpdateDto {
  @IsNumber()
  @Type(() => Number)
  serviceCallId: number;

  @IsNumber()
  @Type(() => Number)
  engineerId: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  hoursWorked?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SparePartDto)
  @IsOptional()
  spareParts?: SparePartDto[];

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateWorkUpdateDto {
  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  hoursWorked?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

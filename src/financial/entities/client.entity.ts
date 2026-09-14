// src/entities/client.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Company } from './company.entity';
import { Employee } from './employee.entity';

export enum ClientDocumentType {
  CEDULA = 'cedula',
  RNC = 'rnc',
  PASAPORTE = 'pasaporte',
}

export enum ClientType {
  INDIVIDUAL = 'individual',
  EMPRESA = 'empresa',
}

export enum ClientStatus {
  ACTIVO = 'activo',
  INACTIVO = 'inactivo',
  CREDITO_BLOQUEADO = 'credito_bloqueado',
}

@Entity('clients')
@Index(['companyId', 'clientCode'], { unique: true }) // código único por empresa, no global
@Index(['companyId', 'documentNumber'], { unique: true }) // misma cédula/RNC puede repetirse entre empresas distintas
@Index(['companyId']) // acelera "dame los clientes de esta empresa", la consulta más común del sistema
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  companyId: string; // Empresa a la que pertenece el cliente en el SaaS

  @ManyToOne(() => Company, (company) => company.clients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'companyId' })
  company: Company;

  // NUEVO: código corto y legible para buscar/facturar (ej. 000101).
  // Se genera en el servicio, no aquí (ver clients.service.ts).
  // El "default: 0" es temporal, solo para que TypeORM pueda agregar la
  // columna a una tabla que ya tiene filas. Después de correr el backfill
  // (ver instrucciones), todo cliente nuevo recibirá su código real desde
  // el servicio, así que este 0 nunca debería volver a usarse.
  @Column({ type: 'integer', default: 0 })
  clientCode: number;

  @Column({ type: 'varchar', length: 150 })
  fullName: string;

  // NUEVO: distingue qué tipo de documento es documentNumber
  @Column({ type: 'enum', enum: ClientDocumentType, default: ClientDocumentType.CEDULA })
  documentType: ClientDocumentType;

  // CORREGIDO: se intentó "nullable: true" para el cliente "Contado" sin
  // documento real, pero TypeORM tiene un bug conocido que revierte la
  // columna a NOT NULL cada vez que reconstruye el índice único compuesto
  // de abajo. En vez de pelear contra eso, se usa un valor por defecto
  // vacío (''). El cliente "Contado" queda con documentNumber = '' en vez
  // de NULL — funciona igual de bien para el mismo propósito.
  @Column({ type: 'varchar', length: 50, default: '' })
  documentNumber: string; // Cédula, RNC o Pasaporte

  // NUEVO: persona física o jurídica (afecta qué documento aplica)
  @Column({ type: 'enum', enum: ClientType, default: ClientType.INDIVIDUAL })
  clientType: ClientType;

  @Column({ type: 'varchar', length: 150, nullable: true })
  email: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 10, nullable: true })
  phoneExtension: string; // Nuevo campo opcional para extensión telefónica

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  // NUEVO: ciudad/provincia separada de la dirección completa
  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  // NUEVO: estado del cliente (ya lo esperaba el frontend, no existía en la BD)
  @Column({ type: 'enum', enum: ClientStatus, default: ClientStatus.ACTIVO })
  status: ClientStatus;

  // NUEVO: límite de crédito (también ya lo esperaba el frontend)
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  creditLimit: number;

  // NUEVO: vendedor asignado (referencia al id del usuario/empleado)
  @Column({ type: 'uuid', nullable: true })
  salespersonId: string;

  @ManyToOne(() => Employee, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'salespersonId' })
  salesperson: Employee;

  // NUEVO: marca el cliente genérico "Contado" usado en ventas al
  // mostrador. Se usa para bloquear su borrado/edición de código en el
  // servicio (no se implementa aquí, es una bandera para que el servicio
  // la respete). Debe haber como máximo un "Contado" real por empresa,
  // pero esa validación vive en el servicio, no en la entidad.
  @Column({ type: 'boolean', default: false })
  isCashClient: boolean;

  // NUEVO: observaciones internas
  @Column({ type: 'text', nullable: true })
  notes: string;

  // NUEVO: Imagen o documento de identidad / Contrato (Soporta ruta local o URL externa)
  @Column({ type: 'varchar', length: 500, nullable: true })
  documentImageUrl: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  contractImageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // NUEVO: borrado suave. TypeORM la llena automáticamente al usar
  // repository.softDelete(...) en vez de repository.delete(...), y la
  // ignora automáticamente en los "find" normales (hay que usar
  // withDeleted: true para verlos). Así nunca se pierde el historial de
  // facturas/créditos/órdenes que ya apuntan a este cliente.
  @DeleteDateColumn()
  deletedAt: Date;
}

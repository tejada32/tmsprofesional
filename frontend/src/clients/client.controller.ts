// src/clients/client.controller.ts
import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { ClientService, CreateClientInput } from './client.service';

@Controller('clients')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Get()
  async findAll(@Req() req: any) {
    return await this.clientService.findAllByCompany(req.user.companyId);
  }

  @Post()
  async create(@Body() createClientDto: CreateClientInput, @Req() req: any) {
    return await this.clientService.create(req.user.companyId, createClientDto);
  }
}

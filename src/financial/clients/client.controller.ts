// src/clients/client.controller.ts
import { Controller, Get, Post, Patch, Param, Body, Req } from '@nestjs/common';
import { ClientService, CreateClientInput, UpdateClientInput } from './client.service';

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

  @Patch(':id')
  async update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateClientDto: UpdateClientInput,
  ) {
    return await this.clientService.update(req.user.companyId, id, updateClientDto);
  }
}
